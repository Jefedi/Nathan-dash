import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Card } from '../components/Card';
import { colors, spacing, fontSize, borderRadius } from '../theme';

export function SettingsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Paramètres</Text>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Application</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Version</Text>
          <Text style={styles.value}>1.0.0</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Plateforme</Text>
          <Text style={styles.value}>iOS / Windows</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Données</Text>
        <Text style={styles.hint}>
          Les tokens de vos bots sont stockés localement sur votre appareil. Aucune donnée n'est envoyée à un serveur tiers.
        </Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>À propos</Text>
        <Text style={styles.hint}>
          Discord Bot Manager — Gérez vos bots Discord depuis une interface épurée, multi-plateforme et responsive.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl * 2 },
  title: { color: colors.text, fontSize: fontSize.xxl, fontWeight: '700', marginBottom: spacing.lg },
  card: { marginBottom: spacing.md },
  sectionTitle: { color: colors.primary, fontSize: fontSize.md, fontWeight: '600', marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { color: colors.textSecondary, fontSize: fontSize.sm },
  value: { color: colors.text, fontSize: fontSize.sm, fontWeight: '500' },
  hint: { color: colors.textMuted, fontSize: fontSize.sm, lineHeight: 20 },
});
