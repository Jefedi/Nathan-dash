import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBots } from '../context/BotContext';
import { colors, spacing, fontSize, borderRadius } from '../theme';

export function BotAddScreen() {
  const [name, setName] = useState('');
  const [token, setToken] = useState('');
  const [prefix, setPrefix] = useState('!');
  const { addBot } = useBots();
  const navigation = useNavigation<any>();

  const canSave = name.trim().length > 0 && token.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    addBot(name.trim(), token.trim(), prefix.trim() || '!');
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Nouveau Bot</Text>

        <Text style={styles.label}>Nom du bot</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Mon super bot"
          placeholderTextColor={colors.textMuted}
        />

        <Text style={styles.label}>Token Discord</Text>
        <TextInput
          style={styles.input}
          value={token}
          onChangeText={setToken}
          placeholder="Collez le token ici..."
          placeholderTextColor={colors.textMuted}
          secureTextEntry
        />

        <Text style={styles.label}>Préfixe de commande</Text>
        <TextInput
          style={styles.input}
          value={prefix}
          onChangeText={setPrefix}
          placeholder="!"
          placeholderTextColor={colors.textMuted}
        />

        <TouchableOpacity
          style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={!canSave}
        >
          <Text style={styles.saveBtnText}>Ajouter le bot</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, maxWidth: 600, alignSelf: 'center', width: '100%' },
  title: { color: colors.text, fontSize: fontSize.xxl, fontWeight: '700', marginBottom: spacing.lg },
  label: { color: colors.textSecondary, fontSize: fontSize.sm, fontWeight: '600', marginBottom: spacing.xs, marginTop: spacing.md },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: fontSize.md,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  saveBtnDisabled: { opacity: 0.4 },
  saveBtnText: { color: '#fff', fontSize: fontSize.md, fontWeight: '700' },
});
