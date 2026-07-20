import React from 'react';
import {
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, radii, spacing } from '../constants/theme';

type Props = {
  onDone: () => void;
};

type Page = {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  body: string;
};

const PAGES: Page[] = [
  {
    icon: 'wind',
    title: 'Welcome',
    body: 'A few slow breaths, whenever you need to reset, focus, or wind down.',
  },
  {
    icon: 'square',
    title: 'Box breathing',
    body: 'Equal parts inhale, hold, exhale, hold. Great for calming nerves and sharpening focus.',
  },
  {
    icon: 'moon',
    title: '4-7-8 breathing',
    body: 'A longer hold and exhale to help your body relax before sleep.',
  },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export function OnboardingScreen({ onDone }: Props) {
  const scrollRef = React.useRef<ScrollView>(null);
  const [pageIndex, setPageIndex] = React.useState(0);
  const isLastPage = pageIndex === PAGES.length - 1;

  const goToPage = (index: number) => {
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
    setPageIndex(index);
  };

  const handleMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setPageIndex(index);
  };

  const handleNext = () => {
    if (isLastPage) {
      onDone();
    } else {
      goToPage(pageIndex + 1);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={styles.pager}
      >
        {PAGES.map((page) => (
          <View key={page.title} style={[styles.page, { width: SCREEN_WIDTH }]}>
            <View style={styles.iconWrap}>
              <Feather name={page.icon} size={32} color={colors.accent} />
            </View>
            <Text style={styles.title}>{page.title}</Text>
            <Text style={styles.body}>{page.body}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {PAGES.map((page, i) => (
            <View
              key={page.title}
              style={[styles.dot, i === pageIndex ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>

        <Pressable style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{isLastPage ? 'Get started' : 'Next'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pager: {
    flex: 1,
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: radii.full,
    backgroundColor: colors.circleFill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radii.full,
  },
  dotActive: {
    backgroundColor: colors.accent,
  },
  dotInactive: {
    backgroundColor: colors.cardBorder,
  },
  nextButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    borderRadius: radii.full,
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  nextButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
