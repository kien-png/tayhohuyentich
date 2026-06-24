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
  const [dialogueState, setDialogueState] = useState('dialogues'); // 'dialogues', 'choices', 'choice_feedback', 'question1', 'question1_feedback', 'postVerifiedDialogues', 'preQuestion2Dialogues', 'question2', 'question2_feedback', 'postQuestion2Dialogues', 'question3', 'question3_feedback', 'postQuestion3Dialogues', 'wishChoices', 'wish_feedback', 'postWishDialogues', 'endingDialogues', 'complete', 'final'
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
  const [audioEnabled, setAudioEnabled] = useState(true);
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
      const audio = new Audio('/assets/audio/background-music.mp3');
      audio.loop = true;
      audio.volume = 0.06;
      
      audio.onloadstart = () => {
        console.log('Background music loading...');
      };
      
      audio.oncanplay = () => {
        console.log('Background music can play');
      };
      
      audio.onplay = () => {
        console.log('Background music started playing at volume:', audio.volume);
      };
      
      audio.onerror = (e) => {
        console.error('Background music error:', e);
        console.log('Trying alternative path...');
        // Try alternative path
        const altAudio = new Audio('src/assets/audio/background-music.mp3');
        altAudio.loop = true;
        altAudio.volume = 0.06;
        backgroundMusicRef.current = altAudio;
        altAudio.play().catch(err => {
          console.error('Alt path failed:', err);
          // Try importing as module
          const moduleAudio = new Audio('/assets/audio/background-music.mp3');
          moduleAudio.loop = true;
          moduleAudio.volume = 0.06;
          backgroundMusicRef.current = moduleAudio;
          moduleAudio.play().catch(err2 => console.error('Module path failed:', err2));
        });
      };
      
      // Ensure user interaction has occurred
      const playPromise = audio.play();
      backgroundMusicRef.current = audio;
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Background music successfully started!');
        }).catch(error => {
          console.error('Background music autoplay was prevented:', error);
          console.log('User needs to interact with the page first');
        });
      }
      
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
  const playAudioFile = async (audioPath, forcePlay = false) => {
    if (!audioEnabled || !audioPath) return;
    
    try {
      if (narratorAudioRef.current) {
        const currentSrc = narratorAudioRef.current.src;
        const isSameFile = currentSrc && (currentSrc.endsWith(audioPath) || decodeURIComponent(currentSrc).endsWith(audioPath));
        if (!forcePlay && isSameFile) {
          if (!narratorAudioRef.current.paused && !narratorAudioRef.current.ended) {
            console.log(`Audio ${audioPath} is already playing, keeping it.`);
            return;
          }
        }
        narratorAudioRef.current.pause();
        narratorAudioRef.current.currentTime = 0;
      }
      
      console.log(`Playing audio: ${audioPath}`);
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
      console.log('Narration audio not available or failed to play', error);
    }
  };

  // Sound chime helpers
  const playNarration = async (stageIndex, dialogueIndex) => {
    // Map specific dialogues to audio files
    let audioPath = null;
    
    // Stage 0 - file a1 covers dialogue 0 to 5 (entire conversation)
    if (stageIndex === 0 && dialogueIndex >= 0 && dialogueIndex <= 5) {
      audioPath = `/assets/audio/a1.mp3`;
    }
    // Stage 1 - file a2 covers dialogue 0 to 4 (intro to Tam Quan)
    else if (stageIndex === 1 && dialogueIndex >= 0 && dialogueIndex <= 4) {
      audioPath = `/assets/audio/a2.mp3`;
    }
    // Stage 1 - file a3 covers dialogue 5 to 7 + question
    else if (stageIndex === 1 && dialogueIndex >= 5 && dialogueIndex <= 7) {
      audioPath = `/assets/audio/a3.mp3`;
    }
    // Stage 2 (Tam Tòa) - file a8 covers dialogue 0 to 1
    else if (stageIndex === 2 && dialogueIndex >= 0 && dialogueIndex <= 1) {
      audioPath = `/assets/audio/a8.mp3`;
    }
    // Stage 3 (Điện Sơn Trang) - file a13 covers dialogue 0
    else if (stageIndex === 3 && dialogueIndex === 0) {
      audioPath = `/assets/audio/a13.mp3`;
    }
    // Stage 4 (Lầu Cô - Lầu Cậu) - file a18 covers dialogue 0
    else if (stageIndex === 4 && dialogueIndex === 0) {
      audioPath = `/assets/audio/a18.mp3`;
    }
    // Stage 5 (Kết Duyên Lành) - file a21 covers dialogue 0, file a22 covers dialogue 1
    else if (stageIndex === 5) {
      if (dialogueIndex === 0) {
        audioPath = `/assets/audio/a21.mp3`;
      } else if (dialogueIndex === 1) {
        audioPath = `/assets/audio/a22.mp3`;
      }
    }
    
    // If no specific audio file, try default naming
    if (!audioPath) {
      audioPath = `/assets/audio/stage${stageIndex}-dialogue${dialogueIndex}.mp3`;
    }

    await playAudioFile(audioPath, true);
  };
  const playQuestionNarration = async (stageIndex, questionType = 'question1') => {
    let audioPath = null;
    
    // Stage 1 - question is part of a3 file
    if (stageIndex === 1) {
      if (questionType === 'question1') {
        audioPath = `/assets/audio/a3.mp3`;
      } else if (questionType === 'question2') {
        // Stage 1 question2 (Sân Phủ) - part of a4 file
        audioPath = `/assets/audio/a4.mp3`;
      }
    }
    // Stage 2 (Tam Tòa) - different questions
    else if (stageIndex === 2) {
      if (questionType === 'question1') {
        audioPath = `/assets/audio/a8.mp3`;
      } else if (questionType === 'question2') {
        audioPath = `/assets/audio/a9.mp3`;
      }
    }
    // Stage 3 (Điện Sơn Trang) - different questions
    else if (stageIndex === 3) {
      if (questionType === 'question1') {
        audioPath = `/assets/audio/a13.mp3`;
      } else if (questionType === 'question2') {
        audioPath = `/assets/audio/a14.mp3`;
      }
    }
    // Stage 4 (Lầu Cô - Lầu Cậu) - question is part of a18 file
    else if (stageIndex === 4) {
      audioPath = `/assets/audio/a18.mp3`;
    }
    
    // If no specific audio file, try default naming
    if (!audioPath) {
      audioPath = `/assets/audio/stage${stageIndex}-question.mp3`;
    }

    await playAudioFile(audioPath, true);
  };

  // Play narration for question feedback
  const playQuestionFeedbackNarration = async (stageIndex, isCorrect, questionType = 'question1') => {
    let audioPath = null;
    
    // Stage 1 question1 feedback
    if (stageIndex === 1 && questionType === 'question1') {
      if (isCorrect) {
        audioPath = `/assets/audio/a7.mp3`;
      }
    }
    // Stage 1 question2 (Sân Phủ) feedback
    else if (stageIndex === 1 && questionType === 'question2') {
      if (isCorrect) {
        audioPath = `/assets/audio/a6.mp3`; // Correct answer feedback
      } else {
        audioPath = `/assets/audio/a5.mp3`; // Wrong answer feedback
      }
    }
    // Stage 2 (Tam Tòa) feedback
    else if (stageIndex === 2 && questionType === 'question2') {
      if (isCorrect) {
        audioPath = `/assets/audio/a11.mp3`; // Correct answer feedback
      } else {
        audioPath = `/assets/audio/a10.mp3`; // Wrong answer feedback
      }
    }
    // Stage 3 (Điện Sơn Trang) feedback
    else if (stageIndex === 3) {
      if (questionType === 'question1' && isCorrect) {
        audioPath = `/assets/audio/a14.mp3`; // Stage 3 question1 correct leads to question2
      } else if (questionType === 'question2') {
        if (isCorrect) {
          audioPath = `/assets/audio/a16.mp3`; // Correct answer feedback
        } else {
          audioPath = `/assets/audio/a15.mp3`; // Wrong answer feedback
        }
      }
    }
    // Stage 4 (Lầu Cô - Lầu Cậu) feedback
    else if (stageIndex === 4 && questionType === 'question1' && isCorrect) {
      audioPath = `/assets/audio/a19.mp3`; // Stage 4 question1 correct feedback + postQuestion1
    }
    
    // If no specific audio path, skip
    if (!audioPath) {
      console.log(`No audio path found for feedback stage ${stageIndex}, question ${questionType}, correct: ${isCorrect}`);
      return;
    }

    await playAudioFile(audioPath, true);
  };

  // Play narration for postVerifiedDialogues
  const playPostVerifiedNarration = async (stageIndex, dialogueIndex) => {
    let audioPath = null;
    
    // Stage 2 (Tam Tòa) postVerifiedDialogues - file a9
    if (stageIndex === 2) {
      audioPath = `/assets/audio/a9.mp3`;
    }
    
    if (!audioPath) {
      console.log(`No audio path found for postVerified stage ${stageIndex}`);
      return;
    }

    await playAudioFile(audioPath, true);
  };
  const playPostQuestion1Narration = async (stageIndex, dialogueIndex) => {
    let audioPath = null;
    
    // Stage 1 postQuestion1Dialogues (Sân Phủ dialogues) - file a4
    if (stageIndex === 1) {
      audioPath = `/assets/audio/a4.mp3`;
    }
    // Stage 4 (Lầu Cô - Lầu Cậu) postQuestion1Dialogues - part of a19
    else if (stageIndex === 4) {
      audioPath = `/assets/audio/a19.mp3`;
    }
    
    if (!audioPath) {
      console.log(`No audio path found for postQuestion1 stage ${stageIndex}`);
      return;
    }

    await playAudioFile(audioPath, true);
  };
  const playPostQuestion2Narration = async (stageIndex, dialogueIndex) => {
    let audioPath = null;
    
    // Stage 1 (Tam Quan) postQuestion2Dialogues - file a7
    if (stageIndex === 1) {
      audioPath = `/assets/audio/a7.mp3`;
    }
    // Stage 2 (Tam Tòa) postQuestion2Dialogues - file a12
    else if (stageIndex === 2) {
      audioPath = `/assets/audio/a12.mp3`;
    }
    // Stage 3 (Điện Sơn Trang) postQuestion2Dialogues - file a17
    else if (stageIndex === 3) {
      audioPath = `/assets/audio/a17.mp3`;
    }
    
    if (!audioPath) {
      console.log(`No audio path found for postQuestion2 stage ${stageIndex}`);
      return;
    }

    await playAudioFile(audioPath, true);
  };
  const playWishFeedbackNarration = async (stageIndex) => {
    let audioPath = null;
    
    // Stage 4 (Lầu Cô - Lầu Cậu) wish feedback - file a20
    if (stageIndex === 4) {
      audioPath = `/assets/audio/a20.mp3`;
    }
    
    if (!audioPath) {
      console.log(`No audio path found for wishFeedback stage ${stageIndex}`);
      return;
    }

    await playAudioFile(audioPath, true);
  };
  const playPostChoiceNarration = async (stageIndex, dialogueIndex) => {
    let audioPath = null;
    
    // Stage 0 postChoiceDialogues - file a2 covers all postChoice dialogues
    if (stageIndex === 0) {
      audioPath = `/assets/audio/a2.mp3`;
    }
    // Stage 1 postChoiceDialogues - file a3 covers "Tốt lắm..." and question
    else if (stageIndex === 1) {
      audioPath = `/assets/audio/a3.mp3`;
    }
    
    // If no specific audio file, try default naming
    if (!audioPath) {
      audioPath = `/assets/audio/stage${stageIndex}-postchoice${dialogueIndex}.mp3`;
    }

    await playAudioFile(audioPath, true);
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
          console.log('Starting background music...');
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
    // Auto-start audio on mount (user can turn off manually)
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } catch (e) {
      console.error('Web Audio init failed', e);
    }
    // Play background music after a short delay to allow browser autoplay
    const timer = setTimeout(() => {
      playBackgroundMusic();
    }, 200);

    return () => {
      clearTimeout(timer);
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

  // Auto-play narration when dialogue state or stage changes
  // NOTE: dialogueIndex is intentionally NOT in deps — audio plays once per state entry,
  // not on every click-next within the same state.
  // NOTE: showDialogueBox is in deps so audio waits for the chat box to appear (e.g. stage 0 has 3s animation delay).
  useEffect(() => {
    // Wait until the dialogue box is actually visible before playing audio
    if (!audioEnabled || !gameStarted || !showDialogueBox) return;

    console.log(`Audio trigger: Stage ${currentStage}, DialogueState: ${dialogueState}`);

    // Only auto-trigger audio for states that represent a new scene/section entry.
    // Feedback states (question1_feedback, question2_feedback, etc.) are NOT included here
    // because their audio is already triggered directly inside handleChoiceSelect / handleOptionSelect.
    if (dialogueState === 'dialogues') {
      if (currentStage === 1) {
        if (dialogueIndex === 0) {
          setTimeout(() => {
            playNarration(currentStage, 0);
          }, 300);
        } else if (dialogueIndex === 5) {
          setTimeout(() => {
            playNarration(currentStage, 5);
          }, 300);
        }
      } else if (currentStage === 5) {
        // Stage 5: 2 dialogues - a21 (index 0) and a22 (index 1)
        if (dialogueIndex === 0 || dialogueIndex === 1) {
          setTimeout(() => {
            playNarration(currentStage, dialogueIndex);
          }, 300);
        }
      } else {
        if (dialogueIndex === 0) {
          setTimeout(() => {
            playNarration(currentStage, 0);
          }, 300);
        }
      }
    } else if (dialogueState === 'postChoiceDialogues') {
      if (dialogueIndex === 0) {
        setTimeout(() => {
          playPostChoiceNarration(currentStage, 0);
        }, 300);
      }
    } else if (dialogueState === 'question1' || dialogueState === 'question2' || dialogueState === 'question3') {
      stopNarration();
    } else if (dialogueState === 'postVerifiedDialogues') {
      if (dialogueIndex === 0) {
        setTimeout(() => {
          playPostVerifiedNarration(currentStage, 0);
        }, 300);
      }
    } else if (dialogueState === 'postQuestion1Dialogues') {
      if (dialogueIndex === 0) {
        setTimeout(() => {
          playPostQuestion1Narration(currentStage, 0);
        }, 300);
      }
    } else if (dialogueState === 'postQuestion2Dialogues') {
      if (dialogueIndex === 0) {
        setTimeout(() => {
          playPostQuestion2Narration(currentStage, 0);
        }, 300);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioEnabled, gameStarted, showDialogueBox, dialogueState, currentStage, dialogueIndex]);

  // Control background music volume during narration
  useEffect(() => {
    if (isNarrationPlaying) {
      adjustBackgroundMusicVolume(0.02); // Duck to 2% during narration
    } else {
      adjustBackgroundMusicVolume(0.06); // Return to 6% when narration stops
    }
  }, [isNarrationPlaying]);

  // Stop narration when leaving active states or changing stage
  useEffect(() => {
    const activeStates = [
      'dialogues', 'postChoiceDialogues', 
      'question1_feedback', 'question2_feedback', 'question3_feedback',
      'preQuestion2Dialogues', 'postQuestion1Dialogues', 'postQuestion2Dialogues', 'postVerifiedDialogues',
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
      case 'preQuestion2Dialogues':
        return stageData.preQuestion2Dialogues[dialogueIndex];
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
        if (currentStage === 0 || currentStage === 1) {
          setDialogueState('choices');
        } else if (currentStage === 2) {
          setDialogueState('question1');
        } else if (currentStage === 3) {
          setDialogueState('question1'); // Stage 3: Điện Sơn Trang
        } else if (currentStage === 4) {
          setDialogueState('question1'); // Stage 4: Lầu Cô - Lầu Cậu
        } else if (currentStage === 5) {
          // Stage 5: cứ đọc hết dialogues rồi → final
          setDialogueState('final');
        }
      }
    }
    else if (dialogueState === 'postChoiceDialogues') {
      if (dialogueIndex < stageData.postChoiceDialogues.length - 1) {
        setDialogueIndex(prev => prev + 1);
      } else {
        if (currentStage === 1) {
          // Stage 1: sau postChoiceDialogues → question1
          setDialogueState('question1');
          setDialogueIndex(0);
        } else {
          // Các stage khác → complete + countdown
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
        // Sai → hỏi lại question1 ở tất cả stage
        setDialogueState('question1');
        setWrongChoiceIndex(null);
      } else {
        if (currentStage === 1) {
          // Stage 1: trả lời đúng → postQuestion1Dialogues (nội dung Sân Phủ)
          setDialogueState('postQuestion1Dialogues');
          setDialogueIndex(0);
        } else if (currentStage === 2) {
          // Stage 2 (Tam Tòa): đúng → postVerifiedDialogues
          setDialogueState('postVerifiedDialogues');
          setDialogueIndex(0);
        } else if (currentStage === 3) {
          // Stage 3 (Điện Sơn Trang): đúng câu 1 → preQuestion2Dialogues → question2
          setDialogueState('preQuestion2Dialogues');
          setDialogueIndex(0);
          setVerified(false); // reset để câu hỏi 2 hiển thị choices
        } else if (currentStage === 4) {
          // Stage 4 (Lầu Cô - Lầu Cậu): đúng → postQuestion1Dialogues (hiện lời nhắn chọn bên)
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
        // Sau postVerifiedDialogues → question2
        setDialogueState('question2');
        setVerified(false);
      }
    }
    else if (dialogueState === 'question2_feedback') {
      if (wrongChoiceIndex !== null) {
        if (currentStage === 1) {
          // Stage 1 (câu hỏi Sân Phủ): sai cũng tiến lên postQuestion2Dialogues
          setWrongChoiceIndex(null);
          setDialogueState('postQuestion2Dialogues');
          setDialogueIndex(0);
        } else if (currentStage === 2) {
          // Stage 2: sai cũng tiến lên postQuestion2Dialogues (không loop lại)
          setWrongChoiceIndex(null);
          setDialogueState('postQuestion2Dialogues');
          setDialogueIndex(0);
        } else if (currentStage === 3) {
          // Stage 3: sai cũng tiến lên postQuestion2Dialogues
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
        if (currentStage === 1) {
          // Stage 1: sau postQuestion1Dialogues (Sân Phủ dialogues) → question2
          setDialogueState('question2');
          setDialogueIndex(0);
          setVerified(false);
        } else if (currentStage === 4) {
          // Stage 4: sau postQuestion1Dialogues → wishChoices
          setDialogueState('wishChoices');
        }
      }
    }
    else if (dialogueState === 'preQuestion2Dialogues') {
      if (dialogueIndex < stageData.preQuestion2Dialogues.length - 1) {
        setDialogueIndex(prev => prev + 1);
      } else {
        setDialogueState('question2');
        setDialogueIndex(0);
      }
    }
    else if (dialogueState === 'postQuestion2Dialogues') {
      if (dialogueIndex < stageData.postQuestion2Dialogues.length - 1) {
        setDialogueIndex(prev => prev + 1);
      } else {
        // Sau postQuestion2Dialogues → complete + countdown (mọi stage)
        setDialogueState('complete');
        if (stageData.countdown > 0) {
          startCountdown(stageData.countdown);
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
      setWrongChoiceIndex(null);
      
      if (currentStage === 1 && dialogueState === 'question1') {
        setVerified(false);
        setDialogueState('postQuestion1Dialogues');
        setDialogueIndex(0);
        playChime(true);
        playAudioFile('/assets/audio/a4.mp3');
        return;
      }
      
      if (currentStage === 2 && dialogueState === 'question1') {
        setVerified(false);
        setDialogueState('postVerifiedDialogues');
        setDialogueIndex(0);
        playChime(true);
        playAudioFile('/assets/audio/a9.mp3');
        return;
      }
      
      if (currentStage === 3 && dialogueState === 'question1') {
        setVerified(false);
        setDialogueState('preQuestion2Dialogues');
        setDialogueIndex(0);
        playChime(true);
        playAudioFile('/assets/audio/a14.mp3');
        return;
      }
      
      if (currentStage === 4 && dialogueState === 'question1') {
        setVerified(false);
        setDialogueState('postQuestion1Dialogues');
        setDialogueIndex(0);
        playChime(true);
        playAudioFile('/assets/audio/a19.mp3');
        return;
      }

      setVerified(true);
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

    // Nếu reply rỗng → Stage 0 nhảy thẳng sang stage tiếp theo
    if (!choice.reply) {
      if (currentStage === 0) {
        playChime(true);
        handleNextStage();
        return;
      }
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
    // Stop all audio immediately when going back
    stopNarration();
    stopBackgroundMusic();
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
              // Start background music when game starts
              if (audioEnabled) {
                setTimeout(() => {
                  console.log('Game started - triggering background music');
                  playBackgroundMusic();
                }, 500);
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
        backgroundImage: `linear-gradient(to bottom, rgba(14, 7, 5, 0.45) 0%, rgba(14, 7, 5, 0.3) 50%, rgba(14, 7, 5, 0.9) 100%), url(${
          (currentStage === 0 && (dialogueState === 'postChoiceDialogues' || dialogueState === 'complete'))
            ? kichbanData[1].background
            : stageData.background
        })`,
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
          <span>CHẶNG {currentStage}/5</span>
        </div>
        <div className="w-full h-1 bg-black/50 rounded-full overflow-hidden border border-[#D4AF37]/15">
          <div
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFB74D] rounded-full transition-all duration-500"
            style={{ width: `${(currentStage / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-grow flex items-end justify-center relative px-4 select-none z-10 pointer-events-none mt-14 pb-0 min-h-[80px] sm:min-h-[180px]">
      </div>

      {/* Interface Dialogue Box Section */}
      <div
        className={`w-full px-2 sm:px-4 pb-8 sm:pb-6 mb-2 sm:mb-0 relative z-20 flex flex-col items-center gap-2 sm:gap-3 shrink-0 transition-opacity duration-1000 ${
          gameStarted && dialogueVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {gameStarted && stageData.character && dialogueState !== 'complete' && dialogueState !== 'final' && (
          <div className="w-full max-w-4xl relative h-0 pointer-events-none">
            <img
              src={stageData.character}
              alt={stageData.characterName}
              className={`absolute bottom-[-32px] h-[38vh] sm:h-[55vh] md:h-[66vh] max-h-[600px] object-contain pointer-events-auto z-0 ${
                currentStage === 0 && !showDialogueBox
                  ? 'left-1/2 -translate-x-1/2 origin-bottom'
                  : 'left-1 sm:left-2 md:left-4 origin-bottom-left'
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
