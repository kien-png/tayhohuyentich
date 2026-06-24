import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, RotateCcw, MapPin, Sparkles } from 'lucide-react';
import { kichbanData } from '../data/kichbanData';
import DialogueBox from './DialogueBox';

export default function TayHoGame() {
  const [currentStage, setCurrentStage] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [dialogueVisible, setDialogueVisible] = useState(false);
  const [showDialogueBox, setShowDialogueBox] = useState(false);

  // Dialogue state machine variables
  const [dialogueState, setDialogueState] = useState('dialogues'); // 'dialogues', 'choices', 'choice_feedback', 'question1', 'question1_feedback', 'postVerifiedDialogues', 'question2', 'question2_feedback', 'postQuestion2Dialogues', 'question3', 'question3_feedback', 'postQuestion3Dialogues', 'wishChoices', 'wish_feedback', 'postWishDialogues', 'endingDialogues', 'complete', 'final'
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [customDialogue, setCustomDialogue] = useState('');

  // Global game state variables
  const [verified, setVerified] = useState(false);
  const [endingChosen, setEndingChosen] = useState(null);
  const [wishPath, setWishPath] = useState(null);
  const [countdownActive, setCountdownActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [wrongChoiceIndex, setWrongChoiceIndex] = useState(null);
  const [incorrectFlash, setIncorrectFlash] = useState(false);
  const [bgTransitioning, setBgTransitioning] = useState(false);

  // Audio states
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioCtxRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const narratorAudioRef = useRef(null);
  const backgroundMusicRef = useRef(null);
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);

  const stageData = kichbanData[currentStage];

  // Sync basic stage info and reset dialog states when stage changes
  useEffect(() => {
    setDialogueState('dialogues');
    setDialogueIndex(0);
    setVerified(false);
    setWrongChoiceIndex(null);
    setCountdownActive(false);
    setTimeLeft(0);
  }, [currentStage]);

  // Manage dialogue visibility timing (delay Chặng 0 dialogue box until Cô Bơ fades in)
  useEffect(() => {
    if (gameStarted) {
      setDialogueVisible(true);
      if (currentStage === 0) {
        setShowDialogueBox(false);
        const timer = setTimeout(() => {
          setShowDialogueBox(true);
        }, 3000); // 3 seconds matching the fade-in animation
        return () => clearTimeout(timer);
      } else {
        setShowDialogueBox(true);
      }
    } else {
      setDialogueVisible(false);
      setShowDialogueBox(false);
    }
  }, [currentStage, gameStarted]);

  // Handle countdown tick
  useEffect(() => {
    let timer;
    if (countdownActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (countdownActive && timeLeft === 0) {
      setCountdownActive(false);
    }
    return () => clearTimeout(timer);
  }, [countdownActive, timeLeft]);

  // Background music helpers
  const playBackgroundMusic = async () => {
    if (!audioEnabled) return;
    
    try {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
      }

      console.log('Attempting to play background music...');
      const audio = new Audio('/src/assets/audio/background-music.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      
      audio.onloadstart = () => {
        console.log('Background music loading...');
      };
      
      audio.oncanplay = () => {
        console.log('Background music can play');
      };
      
      audio.onplay = () => {
        console.log('Background music started playing');
      };
      
      audio.onerror = (e) => {
        console.error('Background music error:', e);
        console.log('Trying alternative path...');
        // Try alternative path
        const altAudio = new Audio('./src/assets/audio/background-music.mp3');
        altAudio.loop = true;
        altAudio.volume = 0.3;
        backgroundMusicRef.current = altAudio;
        altAudio.play().catch(err => console.error('Alt path failed:', err));
      };
      
      backgroundMusicRef.current = audio;
      await audio.play();
      
    } catch (error) {
      console.error('Background music failed to play:', error);
    }
  };

  const stopBackgroundMusic = () => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
      console.log('Background music stopped');
    }
  };

  const adjustBackgroundMusicVolume = (volume) => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = volume;
      console.log(`Background music volume set to: ${volume}`);
    }
  };
  const playChime = (isSuccess) => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isSuccess) {
        // Pentatonic C5 (523.25) -> G5 (783.99) chime
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else {
        // Low buzzer buzz
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);
    } catch (e) { }
  };

  // Sound chime helpers
  const playNarration = async (stageIndex, dialogueIndex) => {
    if (!audioEnabled) return;
    
    try {
      // Map specific dialogues to audio files
      let audioPath = null;
      
      // Stage 0 - file a1 covers dialogue 0 to 5 (entire conversation)
      if (stageIndex === 0 && dialogueIndex >= 0 && dialogueIndex <= 5) {
        audioPath = `/src/assets/audio/a1.mp3`;
      }
      // Stage 1 - file a3 covers dialogue 0 to 2 + question
      else if (stageIndex === 1 && dialogueIndex >= 0 && dialogueIndex <= 2) {
        audioPath = `/src/assets/audio/a3.mp3`;
      }
      // Stage 2 - file a4 covers dialogue 0 to 1
      else if (stageIndex === 2 && dialogueIndex >= 0 && dialogueIndex <= 1) {
        audioPath = `/src/assets/audio/a4.mp3`;
      }
      // Stage 3 - file a8 covers dialogue 0 to 1
      else if (stageIndex === 3 && dialogueIndex >= 0 && dialogueIndex <= 1) {
        audioPath = `/src/assets/audio/a8.mp3`;
      }
      // Stage 4 - file a13 covers dialogue 0
      else if (stageIndex === 4 && dialogueIndex === 0) {
        audioPath = `/src/assets/audio/a13.mp3`;
      }
      // Stage 5 - file a18 covers dialogue 0
      else if (stageIndex === 5 && dialogueIndex === 0) {
        audioPath = `/src/assets/audio/a18.mp3`;
      }
      // Stage 6 - file a21 covers dialogue 0, file a22 covers dialogue 1
      else if (stageIndex === 6) {
        if (dialogueIndex === 0) {
          audioPath = `/src/assets/audio/a21.mp3`;
        } else if (dialogueIndex === 1) {
          audioPath = `/src/assets/audio/a22.mp3`;
        }
      }
      
      // If no specific audio file, try default naming
      if (!audioPath) {
        audioPath = `/src/assets/audio/stage${stageIndex}-dialogue${dialogueIndex}.mp3`;
      }

      // Check if we're already playing the same audio file
      if (narratorAudioRef.current && narratorAudioRef.current.src.includes(audioPath.split('/').pop())) {
        // Same audio file is already playing, don't restart
        return;
      }

      // Stop current narration only if switching to different audio
      if (narratorAudioRef.current) {
        narratorAudioRef.current.pause();
        narratorAudioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(audioPath);
      audio.volume = 0.7;
      
      audio.onloadstart = () => setIsNarrationPlaying(true);
      audio.onended = () => setIsNarrationPlaying(false);
      audio.onerror = () => {
        setIsNarrationPlaying(false);
        console.log(`Audio file not found: ${audioPath}`);
      };
      
      narratorAudioRef.current = audio;
      await audio.play();
      
    } catch (error) {
      setIsNarrationPlaying(false);
      console.log('Narration audio not available or failed to play');
    }
  };

  // Voice narration helpers
  const playQuestionNarration = async (stageIndex, questionType = 'question1') => {
    if (!audioEnabled) return;
    
    try {
      let audioPath = null;
      
      // Stage 1 - question is part of a3 file
      if (stageIndex === 1) {
        audioPath = `/src/assets/audio/a3.mp3`;
      }
      // Stage 2 - question is part of a4 file
      else if (stageIndex === 2) {
        audioPath = `/src/assets/audio/a4.mp3`;
      }
      // Stage 3 - different questions
      else if (stageIndex === 3) {
        if (questionType === 'question1') {
          audioPath = `/src/assets/audio/a8.mp3`;
        } else if (questionType === 'question2') {
          audioPath = `/src/assets/audio/a9.mp3`;
        }
      }
      // Stage 4 - different questions  
      else if (stageIndex === 4) {
        if (questionType === 'question1') {
          audioPath = `/src/assets/audio/a13.mp3`;
        } else if (questionType === 'question2') {
          audioPath = `/src/assets/audio/a14.mp3`;
        }
      }
      // Stage 5 - question is part of a18 file
      else if (stageIndex === 5) {
        audioPath = `/src/assets/audio/a18.mp3`;
      }
      
      // If no specific audio file, try default naming
      if (!audioPath) {
        audioPath = `/src/assets/audio/stage${stageIndex}-question.mp3`;
      }

      // Check if we're already playing the same audio file
      if (narratorAudioRef.current && narratorAudioRef.current.src.includes(audioPath.split('/').pop())) {
        // Same audio file is already playing, don't restart
        return;
      }

      // Stop current narration only if switching to different audio
      if (narratorAudioRef.current) {
        narratorAudioRef.current.pause();
        narratorAudioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(audioPath);
      audio.volume = 0.7;
      
      audio.onloadstart = () => setIsNarrationPlaying(true);
      audio.onended = () => setIsNarrationPlaying(false);
      audio.onerror = () => {
        setIsNarrationPlaying(false);
        console.log(`Audio file not found: ${audioPath}`);
      };
      
      narratorAudioRef.current = audio;
      await audio.play();
      
    } catch (error) {
      setIsNarrationPlaying(false);
      console.log('Narration audio not available or failed to play');
    }
  };

  // Play narration for question feedback
  const playQuestionFeedbackNarration = async (stageIndex, isCorrect, questionType = 'question1') => {
    if (!audioEnabled) return;
    
    try {
      let audioPath = null;
      
      // Stage 2 feedback
      if (stageIndex === 2) {
        if (isCorrect) {
          audioPath = `/src/assets/audio/a6.mp3`; // Correct answer feedback
        } else {
          audioPath = `/src/assets/audio/a5.mp3`; // Wrong answer feedback
        }
      }
      // Stage 3 feedback
      else if (stageIndex === 3 && questionType === 'question2') {
        if (isCorrect) {
          audioPath = `/src/assets/audio/a11.mp3`; // Correct answer feedback
        } else {
          audioPath = `/src/assets/audio/a10.mp3`; // Wrong answer feedback
        }
      }
      // Stage 4 feedback
      else if (stageIndex === 4) {
        if (questionType === 'question1' && isCorrect) {
          audioPath = `/src/assets/audio/a14.mp3`; // Stage 4 question1 correct leads to question2
        } else if (questionType === 'question2') {
          if (isCorrect) {
            audioPath = `/src/assets/audio/a16.mp3`; // Correct answer feedback
          } else {
            audioPath = `/src/assets/audio/a15.mp3`; // Wrong answer feedback
          }
        }
      }
      // Stage 5 feedback
      else if (stageIndex === 5 && questionType === 'question1' && isCorrect) {
        audioPath = `/src/assets/audio/a19.mp3`; // Stage 5 question1 correct feedback + postQuestion1
      }
      
      // If no specific audio file, skip
      if (!audioPath) {
        console.log(`No audio path found for feedback stage ${stageIndex}, question ${questionType}, correct: ${isCorrect}`);
        return;
      }

      console.log(`Playing feedback audio: ${audioPath}`);

      // Stop current narration
      if (narratorAudioRef.current) {
        narratorAudioRef.current.pause();
        narratorAudioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(audioPath);
      audio.volume = 0.7;
      
      audio.onloadstart = () => setIsNarrationPlaying(true);
      audio.onended = () => setIsNarrationPlaying(false);
      audio.onerror = () => {
        setIsNarrationPlaying(false);
        console.log(`Audio file not found: ${audioPath}`);
      };
      
      narratorAudioRef.current = audio;
      await audio.play();
      
    } catch (error) {
      setIsNarrationPlaying(false);
      console.log('Narration audio not available or failed to play');
    }
  };

  // Play narration for postVerifiedDialogues
  const playPostVerifiedNarration = async (stageIndex, dialogueIndex) => {
    if (!audioEnabled) return;
    
    try {
      let audioPath = null;
      
      // Stage 3 postVerifiedDialogues - file a9
      if (stageIndex === 3) {
        audioPath = `/src/assets/audio/a9.mp3`;
      }
      
      if (!audioPath) {
        console.log(`No audio path found for postVerified stage ${stageIndex}`);
        return;
      }

      console.log(`Playing postVerified audio: ${audioPath}`);

      // Check if we're already playing the same audio file
      if (narratorAudioRef.current && narratorAudioRef.current.src.includes(audioPath.split('/').pop())) {
        return;
      }

      if (narratorAudioRef.current) {
        narratorAudioRef.current.pause();
        narratorAudioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(audioPath);
      audio.volume = 0.7;
      
      audio.onloadstart = () => setIsNarrationPlaying(true);
      audio.onended = () => setIsNarrationPlaying(false);
      audio.onerror = () => {
        setIsNarrationPlaying(false);
        console.log(`Audio file not found: ${audioPath}`);
      };
      
      narratorAudioRef.current = audio;
      await audio.play();
      
    } catch (error) {
      setIsNarrationPlaying(false);
      console.log('Narration audio not available or failed to play');
    }
  };

  // Play narration for postQuestion1Dialogues
  const playPostQuestion1Narration = async (stageIndex, dialogueIndex) => {
    if (!audioEnabled) return;
    
    try {
      let audioPath = null;
      
      // Stage 2 postQuestion1Dialogues - file a7
      if (stageIndex === 2) {
        audioPath = `/src/assets/audio/a7.mp3`;
      }
      // Stage 5 postQuestion1Dialogues - part of a19
      else if (stageIndex === 5) {
        audioPath = `/src/assets/audio/a19.mp3`;
      }
      
      if (!audioPath) {
        console.log(`No audio path found for postQuestion1 stage ${stageIndex}`);
        return;
      }

      console.log(`Playing postQuestion1 audio: ${audioPath}`);

      // Check if we're already playing the same audio file
      if (narratorAudioRef.current && narratorAudioRef.current.src.includes(audioPath.split('/').pop())) {
        return;
      }

      if (narratorAudioRef.current) {
        narratorAudioRef.current.pause();
        narratorAudioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(audioPath);
      audio.volume = 0.7;
      
      audio.onloadstart = () => setIsNarrationPlaying(true);
      audio.onended = () => setIsNarrationPlaying(false);
      audio.onerror = () => {
        setIsNarrationPlaying(false);
        console.log(`Audio file not found: ${audioPath}`);
      };
      
      narratorAudioRef.current = audio;
      await audio.play();
      
    } catch (error) {
      setIsNarrationPlaying(false);
      console.log('Narration audio not available or failed to play');
    }
  };

  // Play narration for postQuestion2Dialogues
  const playPostQuestion2Narration = async (stageIndex, dialogueIndex) => {
    if (!audioEnabled) return;
    
    try {
      let audioPath = null;
      
      // Stage 3 postQuestion2Dialogues - file a12
      if (stageIndex === 3) {
        audioPath = `/src/assets/audio/a12.mp3`;
      }
      // Stage 4 postQuestion2Dialogues - file a17
      else if (stageIndex === 4) {
        audioPath = `/src/assets/audio/a17.mp3`;
      }
      
      if (!audioPath) {
        console.log(`No audio path found for postQuestion2 stage ${stageIndex}`);
        return;
      }

      console.log(`Playing postQuestion2 audio: ${audioPath}`);

      // Check if we're already playing the same audio file
      if (narratorAudioRef.current && narratorAudioRef.current.src.includes(audioPath.split('/').pop())) {
        return;
      }

      if (narratorAudioRef.current) {
        narratorAudioRef.current.pause();
        narratorAudioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(audioPath);
      audio.volume = 0.7;
      
      audio.onloadstart = () => setIsNarrationPlaying(true);
      audio.onended = () => setIsNarrationPlaying(false);
      audio.onerror = () => {
        setIsNarrationPlaying(false);
        console.log(`Audio file not found: ${audioPath}`);
      };
      
      narratorAudioRef.current = audio;
      await audio.play();
      
    } catch (error) {
      setIsNarrationPlaying(false);
      console.log('Narration audio not available or failed to play');
    }
  };

  // Play narration for wish feedback
  const playWishFeedbackNarration = async (stageIndex) => {
    if (!audioEnabled) return;
    
    try {
      let audioPath = null;
      
      // Stage 5 wish feedback - file a20
      if (stageIndex === 5) {
        audioPath = `/src/assets/audio/a20.mp3`;
      }
      
      if (!audioPath) {
        console.log(`No audio path found for wishFeedback stage ${stageIndex}`);
        return;
      }

      console.log(`Playing wishFeedback audio: ${audioPath}`);

      if (narratorAudioRef.current) {
        narratorAudioRef.current.pause();
        narratorAudioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(audioPath);
      audio.volume = 0.7;
      
      audio.onloadstart = () => setIsNarrationPlaying(true);
      audio.onended = () => setIsNarrationPlaying(false);
      audio.onerror = () => {
        setIsNarrationPlaying(false);
        console.log(`Audio file not found: ${audioPath}`);
      };
      
      narratorAudioRef.current = audio;
      await audio.play();
      
    } catch (error) {
      setIsNarrationPlaying(false);
      console.log('Narration audio not available or failed to play');
    }
  };

  // Play narration for postChoiceDialogues
  const playPostChoiceNarration = async (stageIndex, dialogueIndex) => {
    if (!audioEnabled) return;
    
    try {
      let audioPath = null;
      
      // Stage 0 postChoiceDialogues - file a2 covers all postChoice dialogues
      if (stageIndex === 0) {
        audioPath = `/src/assets/audio/a2.mp3`;
      }
      
      // If no specific audio file, try default naming
      if (!audioPath) {
        audioPath = `/src/assets/audio/stage${stageIndex}-postchoice${dialogueIndex}.mp3`;
      }

      // Check if we're already playing the same audio file
      if (narratorAudioRef.current && narratorAudioRef.current.src.includes(audioPath.split('/').pop())) {
        // Same audio file is already playing, don't restart
        return;
      }

      // Stop current narration only if switching to different audio
      if (narratorAudioRef.current) {
        narratorAudioRef.current.pause();
        narratorAudioRef.current.currentTime = 0;
      }
      
      const audio = new Audio(audioPath);
      audio.volume = 0.7;
      
      audio.onloadstart = () => setIsNarrationPlaying(true);
      audio.onended = () => setIsNarrationPlaying(false);
      audio.onerror = () => {
        setIsNarrationPlaying(false);
        console.log(`Audio file not found: ${audioPath}`);
      };
      
      narratorAudioRef.current = audio;
      await audio.play();
      
    } catch (error) {
      setIsNarrationPlaying(false);
      console.log('Narration audio not available or failed to play');
    }
  };

  const stopNarration = () => {
    if (narratorAudioRef.current) {
      narratorAudioRef.current.pause();
      narratorAudioRef.current.currentTime = 0;
      setIsNarrationPlaying(false);
    }
  };

  // Toggle audio and stop narration when disabled
  const toggleAudio = () => {
    if (audioEnabled) {
      console.log('Disabling audio...');
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
        synthIntervalRef.current = null;
      }
      stopNarration();
      stopBackgroundMusic();
      setAudioEnabled(false);
    } else {
      console.log('Enabling audio...');
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        setAudioEnabled(true);
        // Play background music after setting audioEnabled to true
        setTimeout(() => {
          playBackgroundMusic();
        }, 100);
      } catch (e) {
        console.error("Web Audio failed", e);
      }
    }
  };

  const playAmbientLoop = () => {
    // This function is replaced by background music file
    // Keeping for compatibility but not used
  };

  useEffect(() => {
    return () => {
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }
      // Cleanup narration audio on unmount
      if (narratorAudioRef.current) {
        narratorAudioRef.current.pause();
        narratorAudioRef.current = null;
      }
      // Cleanup background music on unmount
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);

  // Auto-play narration when dialogue changes
  useEffect(() => {
    if (audioEnabled && gameStarted) {
      console.log(`Audio check: Stage ${currentStage}, DialogueState: ${dialogueState}, DialogueIndex: ${dialogueIndex}`);
      
      if (dialogueState === 'dialogues') {
        setTimeout(() => {
          playNarration(currentStage, dialogueIndex);
        }, 300);
      } else if (dialogueState === 'postChoiceDialogues') {
        setTimeout(() => {
          playPostChoiceNarration(currentStage, dialogueIndex);
        }, 300);
      } else if (dialogueState === 'question1') {
        console.log('Playing question1 audio for stage', currentStage);
        setTimeout(() => {
          playQuestionNarration(currentStage, 'question1');
        }, 300);
      } else if (dialogueState === 'question2') {
        console.log('Playing question2 audio for stage', currentStage);
        setTimeout(() => {
          playQuestionNarration(currentStage, 'question2');
        }, 300);
      } else if (dialogueState === 'question3') {
        setTimeout(() => {
          playQuestionNarration(currentStage, 'question3');
        }, 300);
      } else if (dialogueState === 'postVerifiedDialogues') {
        console.log('Playing postVerified audio for stage', currentStage);
        setTimeout(() => {
          playPostVerifiedNarration(currentStage, dialogueIndex);
        }, 300);
      } else if (dialogueState === 'postQuestion1Dialogues') {
        console.log('Playing postQuestion1 audio for stage', currentStage);
        setTimeout(() => {
          playPostQuestion1Narration(currentStage, dialogueIndex);
        }, 300);
      } else if (dialogueState === 'postQuestion2Dialogues') {
        console.log('Playing postQuestion2 audio for stage', currentStage);
        setTimeout(() => {
          playPostQuestion2Narration(currentStage, dialogueIndex);
        }, 300);
      }
    }
  }, [audioEnabled, gameStarted, dialogueState, dialogueIndex, currentStage]);

  // Stop narration when leaving active states or changing stage
  useEffect(() => {
    const activeStates = [
      'dialogues', 'postChoiceDialogues', 
      'question1', 'question2', 'question3',
      'question1_feedback', 'question2_feedback', 'question3_feedback',
      'postQuestion1Dialogues', 'postQuestion2Dialogues', 'postVerifiedDialogues',
      'wish_feedback'
    ];
    
    if (!activeStates.includes(dialogueState)) {
      stopNarration();
    }
  }, [dialogueState]);

  useEffect(() => {
    // Stop narration when changing to different stage
    stopNarration();
  }, [currentStage]);

  const startCountdown = (seconds) => {
    setTimeLeft(seconds);
    setCountdownActive(true);
  };

  // Compute what dialogue text to show
  const getCurrentDialogueText = () => {
    switch (dialogueState) {
      case 'dialogues':
        return stageData.dialogues[dialogueIndex];
      case 'postVerifiedDialogues':
        return stageData.postVerifiedDialogues[dialogueIndex];
      case 'postQuestion1Dialogues':
        return stageData.postQuestion1Dialogues[dialogueIndex];
      case 'postQuestion2Dialogues':
        return stageData.postQuestion2Dialogues[dialogueIndex];
      case 'postQuestion3Dialogues':
        return stageData.postQuestion3Dialogues[dialogueIndex];
      case 'postChoiceDialogues':
        return stageData.postChoiceDialogues[dialogueIndex];
      case 'postWishDialogues':
        return stageData.postWishDialogues[dialogueIndex];
      case 'question1_feedback':
      case 'question2_feedback':
      case 'question3_feedback':
      case 'choice_feedback':
      case 'wish_feedback':
        return customDialogue;

      default:
        return '';
    }
  };

  // Dialogue progression handler
  const handleDialogueNext = () => {
    if (dialogueState === 'dialogues') {
      if (dialogueIndex < stageData.dialogues.length - 1) {
        setDialogueIndex(prev => prev + 1);
      } else {
        if (currentStage === 0) {
          setDialogueState('choices');
        } else if (currentStage === 1) {
          setDialogueState('question1');
        } else if (currentStage === 2) {
          setDialogueState('question1');
        } else if (currentStage === 3) {
          setDialogueState('question1'); // Stage 3 now uses questions
        } else if (currentStage === 4) {
          setDialogueState('question1'); // Stage 4: Điện Sơn Trang
        } else if (currentStage === 5) {
          setDialogueState('question1'); // Stage 5: Lầu Cô - Lầu Cậu
        } else if (currentStage === 6) {
          // Stage 6: cứ đọc hết dialogues rồi → final
          setDialogueState('final');
        }
      }
    }
    else if (dialogueState === 'postChoiceDialogues') {
      if (dialogueIndex < stageData.postChoiceDialogues.length - 1) {
        setDialogueIndex(prev => prev + 1);
      } else {
        if (currentStage === 0) {
          setDialogueState('complete');
          if (stageData.countdown > 0) {
            startCountdown(stageData.countdown);
          }
        } else if (currentStage === 3) {
          setDialogueState('complete');
          if (stageData.countdown > 0) {
            startCountdown(stageData.countdown);
          }
        }
      }
    }
    else if (dialogueState === 'wish_feedback') {
      // wish reply chứa sẵn nội dung kết thúc → complete luôn
      setDialogueState('complete');
    }
    else if (dialogueState === 'postWishDialogues') {
      if (dialogueIndex < stageData.postWishDialogues.length - 1) {
        setDialogueIndex(prev => prev + 1);
      } else {
        setDialogueState('complete');
      }
    }
    else if (dialogueState === 'question1_feedback') {
      if (wrongChoiceIndex !== null) {
        if (currentStage === 2) {
          // Stage 2: sai cũng tiến lên postQuestion1Dialogues
          setWrongChoiceIndex(null);
          setDialogueState('postQuestion1Dialogues');
          setDialogueIndex(0);
        } else {
          // Stage 1, 3, 4: sai → hỏi lại
          setDialogueState('question1');
          setWrongChoiceIndex(null);
        }
      } else {
        if (currentStage === 1) {
          // Stage 1: trả lời đúng → vào complete + countdown ngay
          setDialogueState('complete');
          if (stageData.countdown > 0) {
            startCountdown(stageData.countdown);
          }
        } else if (currentStage === 2) {
          setDialogueState('postQuestion1Dialogues');
          setDialogueIndex(0);
        } else if (currentStage === 3) {
          // Stage 3: đúng → postVerifiedDialogues
          setDialogueState('postVerifiedDialogues');
          setDialogueIndex(0);
        } else if (currentStage === 4) {
          // Stage 4 (Điện Sơn Trang): đúng câu 1 (Không có tượng Ngũ Hổ) → question2
          setDialogueState('question2');
          setDialogueIndex(0);
          setVerified(false); // reset để câu hỏi 2 hiển thị choices
        } else if (currentStage === 5) {
          // Stage 5 (Lầu Cô - Lầu Cậu): đúng → postQuestion1Dialogues (hiện lời nhắn chọn bên)
          setDialogueState('postQuestion1Dialogues');
          setDialogueIndex(0);
          setVerified(false);
        }
      }
    }
    else if (dialogueState === 'postVerifiedDialogues') {
      if (dialogueIndex < stageData.postVerifiedDialogues.length - 1) {
        setDialogueIndex(prev => prev + 1);
      } else {
        if (currentStage === 1) {
          setDialogueState('question2');
          setVerified(false);
        } else if (currentStage === 3) {
          // Stage 3: sau postVerifiedDialogues → question2
          setDialogueState('question2');
          setVerified(false);
        }
      }
    }
    else if (dialogueState === 'question2_feedback') {
      if (wrongChoiceIndex !== null) {
        if (currentStage === 3) {
          // Stage 3: sai cũng tiến lên postQuestion2Dialogues (không loop lại)
          setWrongChoiceIndex(null);
          setDialogueState('postQuestion2Dialogues');
          setDialogueIndex(0);
        } else if (currentStage === 4) {
          // Stage 4: sai cũng tiến lên postQuestion2Dialogues
          setWrongChoiceIndex(null);
          setDialogueState('postQuestion2Dialogues');
          setDialogueIndex(0);
        } else {
          setDialogueState('question2');
          setWrongChoiceIndex(null);
        }
      } else {
        setDialogueState('postQuestion2Dialogues');
        setDialogueIndex(0);
      }
    }
    else if (dialogueState === 'postQuestion1Dialogues') {
      if (dialogueIndex < stageData.postQuestion1Dialogues.length - 1) {
        setDialogueIndex(prev => prev + 1);
      } else {
        if (currentStage === 2) {
          // Stage 2: sau postQuestion1Dialogues → complete + countdown
          setDialogueState('complete');
          if (stageData.countdown > 0) {
            startCountdown(stageData.countdown);
          }
        } else if (currentStage === 5) {
          // Stage 5: sau postQuestion1Dialogues → wishChoices
          setDialogueState('wishChoices');
        }
      }
    }
    else if (dialogueState === 'postQuestion2Dialogues') {
      if (dialogueIndex < stageData.postQuestion2Dialogues.length - 1) {
        setDialogueIndex(prev => prev + 1);
      } else {
        if (currentStage === 1) {
          setDialogueState('complete');
          if (stageData.countdown > 0) {
            startCountdown(stageData.countdown);
          }
        } else if (currentStage === 2) {
          setDialogueState('question3');
          setVerified(false);
        } else if (currentStage === 3) {
          // Stage 3: sau postQuestion2Dialogues → complete + countdown
          setDialogueState('complete');
          if (stageData.countdown > 0) {
            startCountdown(stageData.countdown);
          }
        } else if (currentStage === 4) {
          // Stage 4 (Điện Sơn Trang): sau postQuestion2Dialogues → complete + countdown
          setDialogueState('complete');
          if (stageData.countdown > 0) {
            startCountdown(stageData.countdown);
          }
        }
      }
    }
    else if (dialogueState === 'question3_feedback') {
      if (wrongChoiceIndex !== null) {
        setDialogueState('question3');
        setWrongChoiceIndex(null);
      } else {
        setDialogueState('postQuestion3Dialogues');
        setDialogueIndex(0);
      }
    }
    else if (dialogueState === 'postQuestion3Dialogues') {
      if (dialogueIndex < stageData.postQuestion3Dialogues.length - 1) {
        setDialogueIndex(prev => prev + 1);
      } else {
        if (currentStage === 2) {
          setDialogueState('complete');
          if (stageData.countdown > 0) {
            startCountdown(stageData.countdown);
          }
        }
      }
    }

  };

  // Quiz / choice option select handlers
  const handleChoiceSelect = (choice, idx) => {
    if (choice.correct) {
      setVerified(true);
      setWrongChoiceIndex(null);
      setCustomDialogue(choice.feedback);

      const feedbackStateName =
        dialogueState === 'question1' ? 'question1_feedback' :
          dialogueState === 'question2' ? 'question2_feedback' : 'question3_feedback';
      setDialogueState(feedbackStateName);

      // Play feedback audio for correct answers
      const questionType = dialogueState === 'question2' ? 'question2' : 'question1';
      playQuestionFeedbackNarration(currentStage, true, questionType);
      playChime(true);
    } else {
      setWrongChoiceIndex(idx);
      setIncorrectFlash(true);
      setCustomDialogue(choice.feedback);

      const feedbackStateName =
        dialogueState === 'question1' ? 'question1_feedback' :
          dialogueState === 'question2' ? 'question2_feedback' : 'question3_feedback';
      setDialogueState(feedbackStateName);

      // Play feedback audio for wrong answers
      const questionType = dialogueState === 'question2' ? 'question2' : 'question1';
      playQuestionFeedbackNarration(currentStage, false, questionType);
      playChime(false);

      setTimeout(() => {
        setIncorrectFlash(false);
      }, 600);
    }
  };

  const handleOptionSelect = (choice) => {
    if (choice.ending) {
      setEndingChosen(choice.ending);
    }
    if (choice.wish) {
      setWishPath(choice.wish);
    }

    // Nếu reply rỗng → kiểm tra postChoiceDialogues trước
    if (!choice.reply) {
      if (stageData.postChoiceDialogues && stageData.postChoiceDialogues.length > 0) {
        setDialogueState('postChoiceDialogues');
        setDialogueIndex(0);
      } else {
        setDialogueState('complete');
        if (stageData.countdown > 0) {
          startCountdown(stageData.countdown);
        }
      }
      playChime(true);
      return;
    }

    if (choice.wish) {
      // Wish choices → wish_feedback (hiện reply rồi → complete)
      setDialogueState('wish_feedback');
      setCustomDialogue(choice.reply);
      // Play wish feedback audio
      playWishFeedbackNarration(currentStage);
      playChime(true);
      return;
    }

    setDialogueState('choice_feedback');
    setCustomDialogue(choice.reply);
    playChime(true);
  };

  const handleNextStage = () => {
    if (currentStage < kichbanData.length - 1) {
      setBgTransitioning(true);
      setTimeout(() => {
        setCurrentStage((prev) => prev + 1);
        setTimeout(() => {
          setBgTransitioning(false);
        }, 150);
      }, 500);
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setCurrentStage(0);
    setDialogueState('dialogues');
    setDialogueIndex(0);
    setCustomDialogue('');
    setVerified(false);
    setEndingChosen(null);
    setWishPath(null);
    setCountdownActive(false);
    setTimeLeft(0);
    setWrongChoiceIndex(null);
    setIncorrectFlash(false);
  };



  const getCharacterClassName = () => {
    let base = stageData.characterStyle || '';
    base = base
      .replace(/bottom-0/g, '')
      .replace(/left-\[[^\]]+\]/g, '')
      .replace(/md:left-\[[^\]]+\]/g, '')
      .replace(/absolute/g, '')
      .replace(/animate-pulse-slow/g, '')
      .trim();

    if (currentStage === 0) {
      return `${base} animate-character-fade-in`;
    }
    return `${base} animate-pulse-slow`;
  };

  // Compile dialogue text and choices for DialogueBox props
  const currentDialogueText = getCurrentDialogueText();

  const getActiveChoices = () => {
    if (dialogueState === 'choices') {
      return stageData.choices;
    }
    if (dialogueState === 'wishChoices') {
      return stageData.wishChoices;
    }
    return null;
  };

  const getActiveQuestion = () => {
    if (dialogueState === 'question1') {
      return stageData.question;
    }
    if (dialogueState === 'question2') {
      return stageData.question2;
    }
    if (dialogueState === 'question3') {
      return stageData.question3;
    }
    return null;
  };

  if (!gameStarted) {
    return (
      <div
        className="relative w-full min-h-screen overflow-hidden bg-black flex flex-col items-center justify-center transition-all duration-700 px-4"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(14, 7, 5, 0.5) 0%, rgba(14, 7, 5, 0.4) 50%, rgba(14, 7, 5, 0.95) 100%), url(${kichbanData[0].background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="z-10 text-center max-w-sm sm:max-w-lg px-4 sm:px-6 flex flex-col items-center gap-4 sm:gap-6 animate-scale-up">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#D4AF37] tracking-[0.1em] uppercase drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] leading-tight">
              TÂY HỒ
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-semibold text-[#D4AF37]/95 tracking-[0.15em] uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] mt-1 leading-tight">
              HUYỀN TÍCH
            </h2>
            <div className="h-[2px] w-20 sm:w-24 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-3 sm:mt-4" />
            <p className="text-xs sm:text-sm text-slate-300 font-ui tracking-[0.1em] uppercase mt-3 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] px-2 leading-relaxed">
              Hành trình khám phá di sản bằng trải nghiệm số
            </p>
          </div>

          <button
            onClick={() => {
              setGameStarted(true);
              if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
              }
            }}
            className="group relative px-8 sm:px-10 py-3 sm:py-4 mt-4 sm:mt-6 rounded-full border-2 border-[#D4AF37] bg-[#1e110d]/80 text-[#D4AF37] hover:text-[#1e110d] hover:bg-[#D4AF37] font-serif font-semibold text-sm sm:text-base tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.35)] transition-all duration-500 cursor-pointer animate-float active:scale-95"
          >
            KHÁM PHÁ
          </button>
        </div>

        {/* Decorative corner lines - hidden on small screens */}
        <div className="hidden sm:block absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#D4AF37]/45 rounded-tl-lg pointer-events-none" />
        <div className="hidden sm:block absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-[#D4AF37]/45 rounded-tr-lg pointer-events-none" />
        <div className="hidden sm:block absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-[#D4AF37]/45 rounded-bl-lg pointer-events-none" />
        <div className="hidden sm:block absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#D4AF37]/45 rounded-br-lg pointer-events-none" />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full min-h-screen overflow-hidden bg-black flex flex-col justify-between transition-all duration-700 ${incorrectFlash ? 'animate-incorrect-glow' : ''
        }`}
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(14, 7, 5, 0.45) 0%, rgba(14, 7, 5, 0.3) 50%, rgba(14, 7, 5, 0.9) 100%), url(${stageData.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Header Bar */}
      <div className="w-full px-3 sm:px-5 py-3 sm:py-4 flex justify-between items-center bg-gradient-to-b from-black/85 to-transparent relative z-20">
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <h2 className="text-xs sm:text-sm font-serif font-semibold text-[#D4AF37] uppercase tracking-[0.15em]">
              Tây Hồ Huyền Tích
            </h2>
          </div>
        </div>
            
        {/* Audio and Restart buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-full border transition-all duration-300 cursor-pointer ${audioEnabled
              ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
              : 'bg-black/60 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            title={audioEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            {audioEnabled ? <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" /> : <VolumeX className="h-3 w-3 sm:h-4 sm:w-4" />}
          </button>

          <button
            onClick={resetGame}
            className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/60 border border-slate-700 text-slate-300 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 cursor-pointer text-[9px] sm:text-[10px] font-ui font-semibold uppercase tracking-wider shadow-md"
            title="Quay lại từ đầu"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Quay lại</span>
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute top-[52px] sm:top-[68px] left-0 w-full px-3 sm:px-5 z-20">
        <div className="flex justify-between text-[8px] sm:text-[9px] text-[#D4AF37]/80 font-ui mb-1 px-0.5">
          <span>HÀNH TRÌNH THỰC ĐỊA</span>
          <span>CHẶNG {currentStage}/6</span>
        </div>
        <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden border border-[#D4AF37]/15">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFB74D] rounded-full transition-all duration-500"
            style={{ width: `${(currentStage / 6) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-grow flex items-end justify-center relative px-4 select-none z-10 pointer-events-none mt-14 pb-0 min-h-[200px] sm:min-h-[280px]">
      </div>

      {/* Interface Dialogue Box Section */}
      <div
        className={`w-full p-4 pb-6 relative z-20 flex flex-col items-center gap-3 shrink-0 transition-opacity duration-1000 ${
          gameStarted && dialogueVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {gameStarted && stageData.character && dialogueState !== 'complete' && dialogueState !== 'final' && (
          <div className="w-full max-w-4xl relative h-0 pointer-events-none">
            <img
              src={stageData.character}
              alt={stageData.characterName}
              className={`absolute bottom-[-32px] h-[66vh] max-h-[600px] object-contain pointer-events-auto z-0 ${
                currentStage === 0 && !showDialogueBox
                  ? 'left-1/2 -translate-x-1/2 origin-bottom'
                  : 'left-2 sm:left-4 origin-bottom-left'
              } ${getCharacterClassName()}`}
            />
          </div>
        )}
        {gameStarted && dialogueVisible && (
          dialogueState === 'final' ? (
            // Final screen: sau khi đọc hết dialogues stage 6
            <div className="w-full flex flex-col items-center gap-4 py-2">
              <div className="relative w-full max-w-2xl bg-[#1e110d]/90 border border-[#D4AF37]/50 rounded-2xl p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.95)] backdrop-blur-md text-center">
                <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#1e110d] px-5 py-1 rounded-full text-xs font-serif font-extrabold uppercase tracking-widest shadow-md border border-[#D4AF37]/30">
                  {stageData.speaker}
                </div>
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-dialogue whitespace-pre-line mt-2 text-center">
                  Cảm ơn con đã đồng hành cùng Phủ Tây Hồ.
                </p>
              </div>

              <button
                onClick={resetGame}
                className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FFB74D] text-[#1a0f0d] hover:brightness-110 active:scale-95 font-serif font-semibold text-sm tracking-[0.15em] shadow-lg transition-all duration-300 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="h-4 w-4" /> QUAY LẠI TỪ ĐẦU
              </button>
            </div>
          ) : (
            // Dialogue & Actions Box
            <>
              {dialogueState !== 'complete' && showDialogueBox && (
                <DialogueBox
                  speaker={stageData.speaker}
                  speakerRole={stageData.speakerRole}
                  dialogue={currentDialogueText}
                  onChoiceSelect={handleChoiceSelect}
                  wrongChoiceIndex={wrongChoiceIndex}
                  question={getActiveQuestion()}
                  verified={verified}
                  choices={getActiveChoices()}
                  onOptionSelect={handleOptionSelect}
                  audioEnabled={audioEnabled}
                  toggleAudio={toggleAudio}
                  onNext={handleDialogueNext}
                  character={stageData.character}
                  isNarrationPlaying={isNarrationPlaying}
                />
              )}

              {/* Navigation Button */}
              {/* Show navigation buttons when in complete stage */}
              {(dialogueState === 'complete') && (
                <div className="w-full max-w-2xl px-2">
                  <button
                    disabled={countdownActive}
                    onClick={handleNextStage}
                    className={`w-full py-3 px-6 rounded-xl font-serif font-semibold text-sm uppercase tracking-[0.2em] shadow-lg transition-all duration-300 cursor-pointer flex justify-center items-center gap-2 ${countdownActive
                      ? 'bg-slate-800/80 border border-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#D4AF37] to-[#FFB74D] text-[#1e110d] hover:brightness-110 active:scale-[0.98]'
                      }`}
                  >
                    {countdownActive ? (
                      <>
                        Đang di chuyển thực địa... ({timeLeft}s)
                      </>
                    ) : (
                      <>
                        {stageData.buttonText}
                        <Sparkles className="h-4 w-4 animate-pulse" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )
        )}
      </div>

      {/* Black Transition Overlay */}
      <div
        className={`absolute inset-0 bg-black z-50 pointer-events-none transition-opacity duration-500 ${bgTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
      />
    </div>
  );
}
