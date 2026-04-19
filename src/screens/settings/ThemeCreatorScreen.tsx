import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {ArrowLeft, Sun, Moon, DeviceMobile, CheckCircle} from 'phosphor-react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme, useThemeConfig, useThemeActions} from '../../hooks/useTheme';
import {accentPresets} from '../../theme/colors';
import {typographyPresets, FontFamily} from '../../theme/typography';
import {ThemeMode} from '../../types/theme';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';

const MODE_OPTIONS: {mode: ThemeMode; icon: React.ReactNode; label: string}[] = [
  {mode: 'light', icon: <Sun size={18} weight="bold" />, label: 'Light'},
  {mode: 'dark', icon: <Moon size={18} weight="bold" />, label: 'Dark'},
  {mode: 'auto', icon: <DeviceMobile size={18} weight="bold" />, label: 'Auto'},
];

export default function ThemeCreatorScreen() {
  const theme = useTheme();
  const config = useThemeConfig();
  const {setMode, setAccent, setFontFamily, setBaseFontSize} = useThemeActions();
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={[styles.safe, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.header, {borderBottomColor: theme.colors.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={22} color={theme.colors.text} weight="bold" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>Theme Creator</Text>
        <View style={{width: 22}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Preview Card */}
        <Card elevated style={styles.preview}>
          <View style={styles.previewHeader}>
            <View style={[styles.previewAccent, {backgroundColor: theme.colors.accent}]} />
            <View style={styles.previewLines}>
              <View style={[styles.previewLine, {backgroundColor: theme.colors.text, width: '60%'}]} />
              <View style={[styles.previewLine, {backgroundColor: theme.colors.textTertiary, width: '40%'}]} />
            </View>
          </View>
          <ProgressBar progress={0.65} height={6} color={theme.colors.accent} />
          <Text style={[styles.previewLabel, {color: theme.colors.textTertiary}]}>Live preview</Text>
        </Card>

        {/* Appearance Mode */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>APPEARANCE</Text>
          <View style={styles.modeRow}>
            {MODE_OPTIONS.map(({mode, icon, label}) => (
              <TouchableOpacity
                key={mode}
                onPress={() => setMode(mode)}
                style={[
                  styles.modeBtn,
                  {
                    backgroundColor: config.mode === mode ? theme.colors.accentMuted : theme.colors.backgroundSecondary,
                    borderColor: config.mode === mode ? theme.colors.accent : theme.colors.border,
                  },
                ]}>
                {React.cloneElement(icon as React.ReactElement, {
                  color: config.mode === mode ? theme.colors.accent : theme.colors.textTertiary,
                })}
                <Text style={[styles.modeBtnLabel, {color: config.mode === mode ? theme.colors.accent : theme.colors.textSecondary}]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Accent Colors */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>ACCENT COLOR</Text>
          <View style={styles.accentGrid}>
            {accentPresets.map(preset => {
              const isSelected = config.accentColor === preset.color;
              return (
                <TouchableOpacity
                  key={preset.name}
                  onPress={() => setAccent(preset.color, preset.light, preset.muted)}
                  style={[
                    styles.accentBtn,
                    {backgroundColor: preset.muted, borderColor: isSelected ? preset.color : 'transparent'},
                  ]}>
                  <View style={[styles.accentSwatch, {backgroundColor: preset.color}]}>
                    {isSelected && <CheckCircle size={16} color="#fff" weight="fill" />}
                  </View>
                  <Text style={[styles.accentName, {color: theme.colors.textSecondary}]}>
                    {preset.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Font */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>FONT STYLE</Text>
          <View style={styles.fontList}>
            {typographyPresets.map(preset => (
              <TouchableOpacity
                key={preset.value}
                onPress={() => setFontFamily(preset.value as FontFamily)}
                style={[
                  styles.fontBtn,
                  {
                    backgroundColor: config.fontFamily === preset.value ? theme.colors.accentMuted : theme.colors.backgroundSecondary,
                    borderColor: config.fontFamily === preset.value ? theme.colors.accent : theme.colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.fontBtnLabel,
                    {color: config.fontFamily === preset.value ? theme.colors.accent : theme.colors.text},
                  ]}>
                  {preset.name}
                </Text>
                {config.fontFamily === preset.value && (
                  <CheckCircle size={16} color={theme.colors.accent} weight="fill" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Font Size */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: theme.colors.textSecondary}]}>TEXT SIZE</Text>
          <View style={styles.sizeRow}>
            {[12, 14, 15, 17, 20].map(size => (
              <TouchableOpacity
                key={size}
                onPress={() => setBaseFontSize(size)}
                style={[
                  styles.sizeBtn,
                  {
                    backgroundColor: config.baseFontSize === size ? theme.colors.accentMuted : theme.colors.backgroundSecondary,
                    borderColor: config.baseFontSize === size ? theme.colors.accent : theme.colors.border,
                  },
                ]}>
                <Text style={[styles.sizeBtnLabel, {color: config.baseFontSize === size ? theme.colors.accent : theme.colors.textSecondary, fontSize: size}]}>
                  Aa
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {flex: 1},
  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth},
  headerTitle: {fontSize: 16, fontWeight: '600'},
  content: {padding: 20, gap: 24},
  preview: {gap: 12, padding: 18},
  previewHeader: {flexDirection: 'row', alignItems: 'center', gap: 12},
  previewAccent: {width: 36, height: 36, borderRadius: 10},
  previewLines: {flex: 1, gap: 6},
  previewLine: {height: 8, borderRadius: 4},
  previewLabel: {fontSize: 11, textAlign: 'center'},
  section: {gap: 12},
  sectionTitle: {fontSize: 11, fontWeight: '700', letterSpacing: 0.8},
  modeRow: {flexDirection: 'row', gap: 10},
  modeBtn: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5},
  modeBtnLabel: {fontSize: 13, fontWeight: '600'},
  accentGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  accentBtn: {width: '22%', alignItems: 'center', gap: 6, padding: 10, borderRadius: 10, borderWidth: 2},
  accentSwatch: {width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center'},
  accentName: {fontSize: 10, fontWeight: '500'},
  fontList: {gap: 8},
  fontBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, borderWidth: 1},
  fontBtnLabel: {fontSize: 15},
  sizeRow: {flexDirection: 'row', gap: 8},
  sizeBtn: {flex: 1, alignItems: 'center', paddingVertical: 12, borderRadius: 10, borderWidth: 1.5},
  sizeBtnLabel: {fontWeight: '600'},
});
