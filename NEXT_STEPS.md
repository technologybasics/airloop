# Breathe App — Story Backlog (MVP → App Store)

Current state: Box breathing + 4-7-8 running in Expo Go on your phone, no
persistence yet, no navigation library, hardcoded streak.

Hand these to Claude Code **one at a time, in order**. Each is scoped to be
a single sitting. Don't skip ahead — later stories assume earlier ones are
done and tested on-device.

---

## Phase 1 — Make it usable for real daily use

### Story 1: Persist session history with AsyncStorage
As a user, I want each completed breathing session saved locally, so my
history survives app restarts.

- Install `@react-native-async-storage/async-storage` via `npx expo install`
- Create `src/services/sessionStore.ts` with `saveSession()`, `getSessions()`,
  types for a `Session` record: `{ id, techniqueId, completedAt, cyclesCompleted }`
- Wire `onComplete` in `App.tsx` to call `saveSession()` instead of `console.log`
- Acceptance: complete a session, force-quit the app, reopen — session
  history is still there (verify by logging `getSessions()` on app start for now)

### Story 2: Real streak calculation
As a user, I want my streak to reflect actual consecutive days I've
practiced, not a hardcoded number.

- Add `getCurrentStreak()` to `sessionStore.ts` — consecutive calendar days
  with at least one completed session, broken if a day is missed
- Replace the hardcoded `streakDays={4}` in `App.tsx` with the real value,
  recalculated on app load and after each completed session
- Acceptance: complete a session today, streak shows 1+; skip a day
  (can fake by manipulating stored dates), streak resets correctly

### Story 3: Haptic feedback on phase transitions
As a user, I want a subtle tap when the phase changes (inhale → hold →
exhale), so I can do this eyes-closed.

- Install `expo-haptics`
- Trigger `Haptics.impactAsync()` on each phase transition inside
  `useBreathingCycle` (light impact for inhale/exhale, medium for hold)
- Add a settings toggle later (Story 5) — for now, on by default
- Acceptance: feel a distinct tap at each phase boundary during a session

### Story 4: Optional sound cues
As a user, I want a soft tone on phase changes and session completion, so
I get feedback even without looking at the screen.

- Install `expo-av`
- Add 2–3 short sound assets (a soft chime for phase change, a slightly
  different one for session complete) — placeholder tones are fine for now
- Play on phase transition and on `isComplete`
- Respect device silent/mute switch (default `expo-av` behavior on iOS)
- Acceptance: sounds play at the right moments and respect the mute switch

---

## Phase 2 — Settings & customization

### Story 5: Settings screen
As a user, I want to adjust cycle count and toggle sound/haptics per
technique, so the app fits my actual routine.

- New `src/screens/SettingsScreen.tsx`
- Settings to expose: cycles for Box breathing, cycles for 4-7-8, cycles for Coherent breathing, cycles for Calm Breathing, cycles for Deep Reset, cycles for Energize,
  haptics on/off
- Persist settings via AsyncStorage (`src/services/settingsStore.ts`)
- Wire the settings gear icon already in `SessionScreen.tsx` header to
  navigate here (simple state toggle in `App.tsx` is fine, no nav library yet)
- `useBreathingCycle` should read cycle count from settings instead of
  `technique.defaultCycles`
- Acceptance: change cycle count in settings, start a session, confirm the
  new count is used and persists after app restart

---

## Phase 3 — Progress & retention

    ### Story 6: Session complete summary screen
As a user, I want a brief summary after finishing a session (cycles done,
duration, streak), so completing feels rewarding.

- New `src/screens/SessionCompleteScreen.tsx`, shown after `isComplete`
  instead of immediately returning to Home
- Show: technique name, cycles completed, total session duration, updated
  streak count, a "Done" button back to Home
- Acceptance: finishing a session shows this screen before Home

### Story 6A: Introduce start button
s a user, I don't want to start the timer automatically. After user chooses the technique on homescreen, on that technique's screen, 
they should have a start button.


### Story 7: Progress screen with calendar heatmap
As a user, I want to see my practice history at a glance, so I stay
motivated.

- New `src/screens/ProgressScreen.tsx`
- Simple heatmap: last ~8 weeks, one cell per day, shaded by whether a
  session happened that day (don't overengineer intensity levels for MVP —
  binary is fine)
- Pull data from `sessionStore.getSessions()`
- Wire the "Progress" bottom nav icon (currently decorative) to this screen
- Acceptance: heatmap correctly reflects real session history

---

## Phase 4 — Polish & robustness

### Story 8: Handle interruptions gracefully
As a user, I don't want a phone call or app backgrounding mid-session to
break the timer or leave the app in a broken state.

- Use `AppState` from React Native to detect backgrounding
- On background during an active session: pause the cycle (don't let
  `setInterval` silently drift or double-fire on foreground)
- On foreground: either resume from where it left off or prompt to
  restart the session — pick one, resume is friendlier
- Note: the session screen has a pre-start "ready" state (`hasStarted ===
  false`) where nothing is running yet — backgrounding/foregrounding here
  should be a no-op, not trigger pause/resume logic
- Acceptance: start a session, background the app for 10+ seconds, return —
  timer state is sane, not skipped ahead or frozen. Also verify
  backgrounding while still on the pre-start ready screen (before tapping
  play) has no effect

### Story 9: Accessibility pass
As a user relying on VoiceOver or larger text, I want the app to be fully
usable.

- Add `accessibilityLabel` to all icon-only buttons (play/pause, close,
  reset, settings gear, back chevron)
- Ensure phase name + countdown are announced via
  `accessibilityLiveRegion` on the circle so VoiceOver users get spoken
  phase changes without looking at the screen
- Test with "Reduce Motion" enabled — the circle's scale animation should
  respect it (skip or shorten the animation, keep the text countdown)
- Acceptance: full session completable with VoiceOver on, and with Reduce
  Motion enabled

### Story 10: First-run onboarding
As a new user, I want a brief intro explaining what box breathing and
4-7-8 are for, so I know which one to pick.

- 2–3 screen swipeable intro shown only on first launch (check an
  AsyncStorage flag `hasOnboarded`)
- Keep it short — this is a utility app, not a content app
- Acceptance: intro shows once on fresh install, never again after

---

## Phase 5 — Navigation scale-up

### Story 11: Migrate to expo-router
As a developer, I want proper file-based navigation now that there are 5+
screens, instead of manual state toggling in `App.tsx`.

- Install and configure `expo-router`
- Convert `App.tsx`'s manual screen-switching into routes: `app/index.tsx`
  (Home), `app/session/[techniqueId].tsx`, `app/session-complete.tsx`,
  `app/progress.tsx`, `app/settings.tsx`
- Preserve all existing behavior — this is a structural refactor, not a
  feature change
- Acceptance: all existing flows work identically, back button/gestures
  behave correctly

---

## Phase 6 — App Store readiness

### Story 12: App identity — icon, splash screen, name ✅ DONE
As a user browsing the App Store, I want a polished icon and launch
experience.

- Design/generate app icon (1024x1024) and splash screen matching the
  Ocean Breath theme (deep teal background, simple breathing-circle mark)
- Configure in `app.json` under `expo.icon` and `expo.splash`
- Finalize app display name - Airloop
- Acceptance: icon and splash render correctly on a real device build,
  not just Expo Go

### Story 13: App config for submission
As a developer, I want `app.json` fully configured for an App Store build.

- Set `expo.ios.bundleIdentifier` (reverse-DNS, e.g.
  `org.technologynext.airloop`)
- Set version + build number
- Add required permission usage strings if any (likely none needed for
  MVP — no camera/location/mic — double check once haptics/sound are in)
- Acceptance: `npx expo-doctor` passes with no errors

### Story 14: EAS Build setup
As a developer, I want a real iOS build (not Expo Go) to test before
submission.

- Install `eas-cli`, run `eas login`, `eas build:configure`
- Run `eas build --platform ios --profile preview` for an internal test build
- Acceptance: build completes, installs via TestFlight or ad-hoc, app runs
  identically to Expo Go version

### Story 15: TestFlight internal testing
As a developer, I want to test the real build on my own device(s) before
public submission.

- `eas submit --platform ios` to push the build to TestFlight
- Install via TestFlight, do a full pass through every screen and both
  techniques
- Acceptance: no crashes, no regressions vs. Expo Go behavior, at least a
  few days of real personal use logged without issues

### Story 16: Privacy policy + App Store privacy details ✅ DONE
As a developer, I need a privacy policy URL and accurate data-collection
disclosure, required for submission.

- Since all data is local-only (AsyncStorage, no backend, no analytics in
  MVP), this is straightforward — write a short privacy policy stating
  that
- Host it somewhere simple (a page on your existing technologynext.app
  domain, or a GitHub Pages page)
- Fill out App Store Connect's "App Privacy" questionnaire accurately
  (should be "no data collected" if that's genuinely true)
- Acceptance: privacy policy URL live and accessible, App Privacy section
  complete in App Store Connect

### Story 17: App Store listing content ✅ DONE
As a developer, I need screenshots, description, and keywords for the
listing.

- Capture screenshots on required device sizes (use the simulator or
  actual device) — Home, Session (mid-animation), Progress
- Write App Store description and keyword list (ASO pass — you've done
  this kind of thing before for other apps in the portfolio)
- Choose category (Health & Fitness) and age rating
- Acceptance: all App Store Connect listing fields complete

### Story 18: Submit for review
As a developer, I want to submit the final build for Apple review.

- `eas build --platform ios --profile production`
- `eas submit --platform ios`
- Answer App Review questionnaire (export compliance — likely "no" for
  encryption beyond standard HTTPS; content rights; etc.)
- Acceptance: submitted, awaiting Apple review

---

## Phase 7 — Monetization (Freemium)

Do this as a v1.1 update after Phase 6 ships and you've used the free
version daily for a couple weeks — you'll have a much better feel for what
premium features actually earn their price once you've lived with the app.

**Paywall boundary for this app:** Box breathing and 4-7-8 stay free
forever — they're the core loop and you use them personally. Everything
gated below is additive, not core-function.

### Story 19: Define entitlement structure
As a developer, I want a single source of truth for what's free vs.
premium, so paywall checks are consistent everywhere in the app.

- Create `src/constants/entitlements.ts` defining a `PREMIUM_FEATURES` enum:
  `EXTRA_TECHNIQUES`, `CUSTOM_TECHNIQUE`, `FULL_HISTORY`, `SOUNDSCAPES`,
  `SMART_REMINDERS`, `DATA_EXPORT`, `EXTRA_THEMES`
- Add a simple `useEntitlement(feature)` hook stub returning `false` for
  now (real logic comes in Story 20) — build all premium UI against this
  hook from the start so wiring in real purchases later is a one-line change
- Acceptance: hook exists, returns false everywhere, no premium features
  accessible yet

### Story 20: Integrate RevenueCat for subscriptions
As a developer, I want reliable subscription/purchase handling without
building StoreKit integration from scratch.

- Install `react-native-purchases` (RevenueCat's SDK), configure a
  RevenueCat account and iOS app entry
- Define one subscription product in App Store Connect (e.g. monthly +
  annual, or a single "Premium" tier — keep it to one tier for v1, you can
  add tiers later once you see what converts)
- Wire `useEntitlement()` to check RevenueCat's real entitlement status
  instead of returning `false`
- Acceptance: sandbox test purchase unlocks entitlement, restores
  correctly on reinstall

### Story 21: Paywall screen
As a user, I want a clear, non-annoying screen explaining what premium
unlocks and what it costs.

- New `src/screens/PaywallScreen.tsx` — list premium features with icons,
  price, "Start free trial" or "Subscribe" CTA, "Restore purchases" link
- Trigger it when a user taps a locked feature (extra technique, custom
  builder, etc.) rather than as an interruptive launch popup
- Acceptance: paywall shows on locked-feature tap, purchase flow completes
  in sandbox, entitlement updates immediately after purchase

### Story 22: Additional premium techniques
As a premium user, I want more breathing techniques beyond Box and 4-7-8.

- Add 2–3 new `Technique` entries to `phases.ts`: coherent/resonance
  breathing (5-5, no hold), physiological sigh, extended-exhale relaxation
- Gate them on `HomeScreen` behind `useEntitlement(EXTRA_TECHNIQUES)` — show
  them in the list with a small lock icon for free users, tapping opens
  the paywall
- Acceptance: free users see locked techniques and can preview but not
  start them; premium users can start them normally

### Story 23: Custom technique builder
As a premium user, I want to define my own breathing pattern.

- New `src/screens/CustomTechniqueScreen.tsx` — sliders/inputs for
  inhale/hold/exhale/hold durations and cycle count
- Persist custom techniques via AsyncStorage, feed into the same
  `useBreathingCycle` hook (no changes needed there — this is exactly why
  that hook was built generic from the start)
- Gate entry point behind `useEntitlement(CUSTOM_TECHNIQUE)`
- Acceptance: a custom pattern runs correctly through the existing session
  screen and circle animation, no special-casing needed downstream

### Story 24: Extended progress history (freemium split)
As a free user I see recent history; as a premium user I see everything.

- Cap `ProgressScreen` heatmap to last 14 days for free users, show a
  "See full history — Premium" prompt below the cutoff
- Premium users see full history plus (nice-to-have) simple trend text,
  e.g. "You practice most consistently in the evening"
- Acceptance: free/premium split renders correctly, upgrade prompt links
  to paywall

### Story 25: Ambient soundscapes
As a premium user, I want background ambience during sessions, not just
phase-change chimes.

- Add 2–3 looping ambient tracks (rain, ocean, low drone) via `expo-av`
- Soundscape picker in Settings, gated behind
  `useEntitlement(SOUNDSCAPES)`
- Acceptance: selected soundscape loops cleanly through a full session,
  free users see the picker but tapping any option opens the paywall

### Story 26: Smart reminders
As a premium user, I want scheduled local notifications reminding me to
practice.

- Install `expo-notifications`
- Settings section: enable reminder, pick time, pick technique
- Schedule local notification via `expo-notifications`, gated behind
  `useEntitlement(SMART_REMINDERS)`
- Acceptance: notification fires at scheduled time, deep-links into the
  right session on tap

### Story 27: Data export
As a premium user, I want to export my session history.

- Add "Export history" in Settings, generates a CSV of all sessions
  (date, technique, cycles, duration) and opens the native share sheet
  (`expo-sharing`)
- Gate behind `useEntitlement(DATA_EXPORT)`
- Acceptance: exported CSV opens correctly in Numbers/Excel/Sheets

### Story 28: Extra themes
As a premium user, I want to switch between the color themes you
originally sketched (Dusk, Forest, Mono) in addition to Ocean Breath.

- Refactor `theme.ts` into a theme registry, add the 3 alternate palettes
  from earlier design exploration
- Theme picker in Settings, only Ocean Breath available free, others gated
  behind `useEntitlement(EXTRA_THEMES)`
- Acceptance: switching themes updates all screens live, persists across
  restart

### Story 29: App Store Connect subscription submission
As a developer, I need the subscription product properly configured and
disclosed for App Review.

- Add subscription terms, pricing, and localized description in App Store
  Connect
- Add required subscription disclosure text in the paywall screen itself
  (Apple requires price, duration, auto-renewal terms visible before
  purchase — check current App Review Guidelines section 3.1.2 for exact
  wording requirements at time of submission)
- Submit update for review
- Acceptance: submitted, no rejection on subscription disclosure grounds

---

## Phase 8 — Cloud Sync (Supabase)

Only start this phase once there's a real trigger — someone (possibly you)
losing history on a phone switch, wanting iPad support, or adding Android.
Don't build this speculatively; it adds real complexity (auth, conflict
resolution, privacy disclosure) for no MVP benefit.

Uses Supabase, consistent with the rest of your app portfolio.

### Story 30: Supabase project & schema
As a developer, I want a Supabase project with a schema mirroring the
local data model, so sync has somewhere to write to.

- Create Supabase project, set up `sessions` table (`id`, `user_id`,
  `technique_id`, `completed_at`, `cycles_completed`), `settings` table,
  `custom_techniques` table
- Enable Row Level Security — each user can only read/write their own rows
- Add `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY` to a
  `.env` (gitignored), install `@supabase/supabase-js`
- Acceptance: schema deployed, RLS policies verified with a manual test
  query from two different fake user IDs

### Story 31: Authentication
As a user, I want to sign in so my data can sync across devices.

- Use Supabase Auth with **Sign in with Apple** as the primary method
  (required by App Store guidelines if you offer any other third-party
  login, and it's the lowest-friction option for iOS users) — email
  magic-link as a fallback
- New `src/screens/SignInScreen.tsx`, shown as an optional entry point
  from Settings ("Sign in to back up your data"), never forced — the app
  must remain fully usable signed-out, since that's still a valid free-tier
  path
- Acceptance: sign in/out works, session persists across app restarts via
  Supabase's session storage

### Story 32: Migrate local history to cloud on first sign-in
As a user, I want my existing local session history uploaded when I first
sign in, so I don't lose what I've already built up.

- On first successful sign-in, read all local AsyncStorage sessions and
  bulk-insert them into Supabase, tagged with the new `user_id`
- Mark migration complete with a local flag so it doesn't re-run
- Acceptance: sign in on a device with existing history, confirm all
  sessions appear in the Supabase table exactly once (no duplicates)

### Story 33: Ongoing sync for new sessions and settings
As a signed-in user, I want new sessions and settings changes to sync
automatically going forward.

- Update `sessionStore.saveSession()` to write to both AsyncStorage
  (instant local read) and Supabase (when signed in and online) —
  local-first, cloud as a mirror
- Same dual-write pattern for `settingsStore` and custom techniques
- If offline, queue writes locally and flush to Supabase on reconnect
  (a simple pending-queue in AsyncStorage is enough for MVP — no need for
  a full sync engine)
- Acceptance: complete a session offline, reconnect, confirm it appears in
  Supabase without duplication or loss

### Story 34: Pull sync on sign-in (new device)
As a user signing in on a new or reinstalled app, I want my cloud history
downloaded so it appears immediately.

- On sign-in, if local history is empty (fresh install) or the user
  confirms, pull all sessions/settings from Supabase into local
  AsyncStorage for fast subsequent reads
- If local history is non-empty (e.g. signing into an account on a device
  that already has other local data), prompt: merge or keep cloud as
  source of truth — simplest correct behavior for MVP is "merge by
  session id, cloud wins on conflict"
- Acceptance: sign in on a fresh install, full history and settings appear
  correctly

### Story 35: Account deletion
As a user, I want to delete my account and cloud data, since this is
required for App Store compliance once accounts exist.

- Add "Delete account" in Settings, confirms, deletes all Supabase rows
  for that `user_id` and the auth user itself
- Local data remains (still usable signed-out) unless the user also
  chooses to clear local history
- Acceptance: account and all associated cloud rows verifiably gone after
  deletion; app remains functional signed-out afterward

### Story 36: Update privacy policy & App Store privacy labels
As a developer, I need accurate disclosure now that account data exists.

- Update the privacy policy (from Story 16) to describe what's collected
  (email or Apple ID, session history), that it's used only for sync, and
  how to delete it
- Update App Store Connect's "App Privacy" section — this will no longer
  be "no data collected" once auth ships, needs to reflect account +
  usage data accurately
- Acceptance: policy and App Store Connect disclosures both accurate and
  consistent with actual data handling

---

## How to use this with Claude Code

Paste one story at a time as a prompt, e.g.:

> Implement Story 1 from NEXT_STEPS.md: persist session history with
> AsyncStorage. Here's the current project structure: [paste or point to
> the repo]. Follow the existing code style in src/hooks and src/screens.

Keep `NEXT_STEPS.md` in your repo root and check off stories as you go —
useful context for Claude Code to know what's already built when you start
a new session on a story.
