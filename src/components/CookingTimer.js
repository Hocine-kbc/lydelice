import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function CookingTimer({ initialMinutes = 0, onTimerDone }) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes > 0 ? initialMinutes * 60 : 300);
  const [remaining, setRemaining] = useState(initialMinutes > 0 ? initialMinutes * 60 : 300);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  // Pulse animation for active timer
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef(null);

  useEffect(() => {
    if (initialMinutes > 0) {
      setTotalSeconds(initialMinutes * 60);
      setRemaining(initialMinutes * 60);
      setIsRunning(false);
    }
  }, [initialMinutes]);

  useEffect(() => {
    if (isRunning) {
      pulseLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.04,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulseLoop.current.start();

      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            handleFinished();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pulseLoop.current) pulseLoop.current.stop();
      pulseAnim.setValue(1);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (pulseLoop.current) pulseLoop.current.stop();
    };
  }, [isRunning]);

  const handleFinished = () => {
    try {
      if (Platform.OS !== 'web') {
        Vibration.vibrate([600, 400, 600, 400]);
      }
    } catch (e) {}

    Alert.alert(
      '⏰ Minuteur terminé !',
      'Votre temps de cuisson est écoulé. Votre plat est prêt !',
      [{ text: 'Parfait !', onPress: () => onTimerDone && onTimerDone() }]
    );
  };

  const toggleRun = () => {
    if (remaining === 0) {
      setRemaining(totalSeconds);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setRemaining(totalSeconds);
  };

  const setPreset = (mins) => {
    setIsRunning(false);
    const secs = mins * 60;
    setTotalSeconds(secs);
    setRemaining(secs);
  };

  const adjustSeconds = (deltaSecs) => {
    setRemaining((prev) => {
      const next = Math.max(10, prev + deltaSecs);
      setTotalSeconds(next);
      return next;
    });
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = totalSeconds > 0 ? remaining / totalSeconds : 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.iconBadge}>
          <Ionicons name="timer" size={20} color={COLORS.textLight} />
        </View>
        <View>
          <Text style={styles.cardTitle}>Minuteur de Cuisson</Text>
          <Text style={styles.cardSub}>
            {isRunning ? 'Cuisson en cours...' : 'Prêt à démarrer'}
          </Text>
        </View>
        {isRunning && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>ACTIF</Text>
          </View>
        )}
      </View>

      {/* Animated Big Display */}
      <Animated.View
        style={[
          styles.timerDisplayContainer,
          isRunning && styles.timerDisplayRunning,
          { transform: [{ scale: pulseAnim }] },
        ]}
      >
        <Text style={[styles.timerText, isRunning && styles.timerTextRunning]}>
          {formatTime(remaining)}
        </Text>

        {/* Dynamic Progress Bar */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress * 100}%` },
              isRunning && styles.progressBarFillActive,
            ]}
          />
        </View>

        {/* Pill Adjust buttons */}
        <View style={styles.adjustRow}>
          <TouchableOpacity
            style={styles.adjustBtn}
            onPress={() => adjustSeconds(-60)}
            disabled={isRunning || remaining <= 60}
          >
            <Text style={styles.adjustBtnText}>-1 min</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.adjustBtn}
            onPress={() => adjustSeconds(-15)}
            disabled={isRunning || remaining <= 15}
          >
            <Text style={styles.adjustBtnText}>-15 s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.adjustBtn}
            onPress={() => adjustSeconds(15)}
            disabled={isRunning}
          >
            <Text style={styles.adjustBtnText}>+15 s</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.adjustBtn}
            onPress={() => adjustSeconds(60)}
            disabled={isRunning}
          >
            <Text style={styles.adjustBtnText}>+1 min</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Main Pill Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.mainBtn, isRunning ? styles.pauseBtn : styles.startBtn]}
          onPress={toggleRun}
          activeOpacity={0.85}
        >
          <Ionicons
            name={isRunning ? 'pause' : 'play'}
            size={22}
            color={COLORS.textLight}
          />
          <Text style={styles.mainBtnText}>
            {isRunning ? 'Pause' : remaining === 0 ? 'Relancer' : 'Démarrer le chrono'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetBtn}
          onPress={resetTimer}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={20} color={COLORS.primaryMedium} />
          <Text style={styles.resetBtnText}>Remise à zéro</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Pill Presets */}
      <View style={styles.presetsContainer}>
        <Text style={styles.presetsTitle}>Préréglages culinaires rapides :</Text>
        <View style={styles.presetsRow}>
          {[
            { label: '3 min • Œuf coque', min: 3 },
            { label: '5 min • Œuf mollet', min: 5 },
            { label: '10 min • Pâtes', min: 10 },
            { label: '15 min • Vapeur', min: 15 },
            { label: '25 min • Gâteau', min: 25 },
            { label: '45 min • Four', min: 45 },
          ].map((preset) => {
            const isPresetActive = totalSeconds === preset.min * 60;
            return (
              <TouchableOpacity
                key={preset.min}
                style={[styles.presetChip, isPresetActive && styles.presetChipActive]}
                onPress={() => setPreset(preset.min)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.presetChipText,
                    isPresetActive && styles.presetChipTextActive,
                  ]}
                >
                  {preset.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 26,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    elevation: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  cardSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  liveBadge: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 9999,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 9999,
    backgroundColor: COLORS.mint,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  timerDisplayContainer: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  timerDisplayRunning: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.mint,
  },
  timerText: {
    fontSize: 54,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
    marginBottom: 12,
  },
  timerTextRunning: {
    color: COLORS.primary,
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 9999,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primaryMedium,
    borderRadius: 9999,
  },
  progressBarFillActive: {
    backgroundColor: COLORS.mint,
  },
  adjustRow: {
    flexDirection: 'row',
    gap: 8,
  },
  adjustBtn: {
    backgroundColor: COLORS.surface,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  adjustBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryMedium,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 18,
  },
  mainBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 9999,
    gap: 8,
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  startBtn: {
    backgroundColor: COLORS.primary,
  },
  pauseBtn: {
    backgroundColor: COLORS.accent,
  },
  mainBtnText: {
    color: COLORS.textLight,
    fontSize: 15,
    fontWeight: '800',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    gap: 6,
  },
  resetBtnText: {
    color: COLORS.primaryMedium,
    fontSize: 13,
    fontWeight: '700',
  },
  presetsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 14,
  },
  presetsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetChip: {
    backgroundColor: COLORS.surfaceVariant,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  presetChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primaryDark,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  presetChipTextActive: {
    color: COLORS.textLight,
    fontWeight: '700',
  },
});
