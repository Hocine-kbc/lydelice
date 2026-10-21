import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

export default function CookingTimer({ initialMinutes = 0, onTimerDone }) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes > 0 ? initialMinutes * 60 : 300); // 5 min default
  const [remaining, setRemaining] = useState(initialMinutes > 0 ? initialMinutes * 60 : 300);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (initialMinutes > 0) {
      setTotalSeconds(initialMinutes * 60);
      setRemaining(initialMinutes * 60);
      setIsRunning(false);
    }
  }, [initialMinutes]);

  useEffect(() => {
    if (isRunning) {
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
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleFinished = () => {
    try {
      if (Platform.OS !== 'web') {
        Vibration.vibrate([500, 500, 500, 500]);
      }
    } catch (e) {}

    Alert.alert(
      '⏰ Minuteur terminé !',
      'Votre temps de cuisson est écoulé. Bon appétit !',
      [{ text: 'Super !', onPress: () => onTimerDone && onTimerDone() }]
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

  const progress = totalSeconds > 0 ? (remaining / totalSeconds) : 0;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="timer" size={24} color={COLORS.primary} />
        <Text style={styles.cardTitle}>Minuteur de Cuisine</Text>
      </View>

      {/* Big Display */}
      <View style={styles.timerDisplayContainer}>
        <Text style={styles.timerText}>{formatTime(remaining)}</Text>
        
        {/* Progress bar */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>

        {/* Adjust buttons */}
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
      </View>

      {/* Main Controls */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={[styles.mainBtn, isRunning ? styles.pauseBtn : styles.startBtn]}
          onPress={toggleRun}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isRunning ? 'pause' : 'play'}
            size={22}
            color={COLORS.textLight}
          />
          <Text style={styles.mainBtnText}>
            {isRunning ? 'Pause' : remaining === 0 ? 'Relancer' : 'Démarrer'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resetBtn}
          onPress={resetTimer}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={20} color={COLORS.textSecondary} />
          <Text style={styles.resetBtnText}>Réinitialiser</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Presets */}
      <View style={styles.presetsContainer}>
        <Text style={styles.presetsTitle}>Préréglages rapides :</Text>
        <View style={styles.presetsRow}>
          {[
            { label: '3 min (Œuf)', min: 3 },
            { label: '5 min', min: 5 },
            { label: '10 min (Pâtes)', min: 10 },
            { label: '15 min', min: 15 },
            { label: '30 min', min: 30 },
            { label: '45 min', min: 45 },
          ].map((preset) => (
            <TouchableOpacity
              key={preset.min}
              style={[
                styles.presetChip,
                totalSeconds === preset.min * 60 && styles.presetChipActive,
              ]}
              onPress={() => setPreset(preset.min)}
            >
              <Text
                style={[
                  styles.presetChipText,
                  totalSeconds === preset.min * 60 && styles.presetChipTextActive,
                ]}
              >
                {preset.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 18,
    margin: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  timerDisplayContainer: {
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  timerText: {
    fontSize: 52,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
    marginBottom: 10,
  },
  progressBarTrack: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 14,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  adjustRow: {
    flexDirection: 'row',
    gap: 8,
  },
  adjustBtn: {
    backgroundColor: COLORS.surface,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  adjustBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  mainBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  startBtn: {
    backgroundColor: COLORS.primary,
  },
  pauseBtn: {
    backgroundColor: COLORS.warning,
  },
  mainBtnText: {
    color: COLORS.textLight,
    fontSize: 16,
    fontWeight: '700',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    gap: 6,
  },
  resetBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  presetsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: 12,
  },
  presetsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    backgroundColor: COLORS.surfaceVariant,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  presetChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  presetChipTextActive: {
    color: COLORS.primary,
  },
});
