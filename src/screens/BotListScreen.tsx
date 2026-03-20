import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBots } from '../context/BotContext';
import { BotCard } from '../components/BotCard';
import { EmptyState } from '../components/EmptyState';
import { colors, spacing, fontSize, borderRadius } from '../theme';

export function BotListScreen() {
  const { bots, setStatus } = useBots();
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const numColumns = width >= 1024 ? 3 : width >= 600 ? 2 : 1;

  const handleToggle = (bot: { id: string; status: string }) => {
    if (bot.status === 'online' || bot.status === 'starting') {
      setStatus(bot.id, 'offline');
    } else {
      setStatus(bot.id, 'starting');
      setTimeout(() => setStatus(bot.id, 'online'), 1500);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes Bots</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('BotAdd')}>
          <Text style={styles.addBtnText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      {bots.length === 0 ? (
        <EmptyState title="Aucun bot" subtitle="Ajoutez votre premier bot Discord pour commencer" />
      ) : (
        <FlatList
          key={numColumns}
          data={bots}
          numColumns={numColumns}
          keyExtractor={b => b.id}
          contentContainerStyle={styles.list}
          columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
          renderItem={({ item }) => (
            <View style={numColumns > 1 ? styles.col : undefined}>
              <BotCard
                bot={item}
                onPress={() => navigation.navigate('BotDetail', { botId: item.id })}
                onToggle={() => handleToggle(item)}
              />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.md },
  title: { color: colors.text, fontSize: fontSize.xxl, fontWeight: '700' },
  addBtn: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.md },
  addBtnText: { color: '#fff', fontWeight: '600', fontSize: fontSize.sm },
  list: { padding: spacing.md, paddingTop: 0 },
  row: { gap: spacing.md },
  col: { flex: 1 },
});
