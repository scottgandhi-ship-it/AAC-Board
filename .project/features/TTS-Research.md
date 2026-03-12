# Text-to-Speech Research for AAC Communication Board PWA

**Status**: RESEARCH ONLY -- No code generation
**Date**: 2026-03-07
**Purpose**: Comprehensive TTS options analysis for a web-based PWA AAC board

---

## Table of Contents

1. Web Speech API (Built-in Browser TTS)
2. Cloud TTS APIs (Premium Voices)
3. Cost Modeling
4. Hybrid Approach
5. Offline Considerations
6. Child-Appropriate Voices
7. Recommendations

---

## 1. Web Speech API (Built-in Browser TTS)

### How It Works

The Web Speech API's `SpeechSynthesis` interface is built into modern browsers. It provides a controller for the device's native speech synthesis engine. Usage is straightforward:

    const utterance = new SpeechSynthesisUtterance("Hello world");
    utterance.voice = selectedVoice;  // from getVoices()
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    speechSynthesis.speak(utterance);

Voices are retrieved via `speechSynthesis.getVoices()`, which returns a list of `SpeechSynthesisVoice` objects. The available voices depend entirely on the user's operating system, browser, and installed language packs.

### Voices Available by Platform

**iOS Safari**:
- Uses Apple's built-in system voices (e.g., Samantha, Alex, Daniel, Karen, Moira)
- "Enhanced" quality versions available if user has downloaded them in Settings -> Accessibility -> Spoken Content
- Samantha is the most common default US English voice
- WARNING: Siri voices are NOT available through the Web Speech API -- Apple restricts them to native apps
- WARNING: `getVoices()` on Safari can sometimes return an empty list initially; requires listening for the `voiceschanged` event
- Typical count: ~40-60 voices depending on installed language packs

**Android Chrome**:
- Uses Google's TTS engine voices by default
- Voice quality varies significantly by device manufacturer (Samsung, Pixel, etc.)
- Chrome returns an unfiltered list of languages/regions, many of which require downloading a voice pack
- If a voice pack isn't installed, Chrome silently falls back to an English voice instead of failing
- Users must navigate deep into system settings to download additional voices
- Typical count: ~20-30 voices available by default, more with downloads

**Windows (Chrome/Edge)**:
- Uses Microsoft's built-in voices (David, Zira for US English)
- Edge provides additional high-quality voices that sound noticeably more natural than Chrome's
- Windows 10/11 has "Microsoft Online" neural voices available in Edge only
- Typical count: ~3-5 built-in, Edge adds ~20+ neural voices

**macOS (Chrome/Safari)**:
- Uses Apple's system voices (Samantha, Alex, etc.)
- Higher quality "Premium" voices available if downloaded in System Preferences
- Typical count: ~60-80+ voices with all language packs

### Quality Assessment

- **Built-in standard voices**: Robotic, clearly synthetic. Adequate for short phrases but unpleasant for extended use. Sound quality roughly equivalent to TTS from 2010-2015 era.
- **Enhanced/Premium system voices**: Moderate quality. Better prosody and naturalness. Apple's Enhanced voices and Microsoft Edge's online voices are noticeably better.
- **Compared to cloud voices**: Built-in voices are 1-2 generations behind current cloud neural TTS. Cloud voices sound nearly indistinguishable from human speech; built-in voices clearly sound synthetic.

### Offline Availability

- **YES -- built-in voices work offline**. This is critical for AAC.
- Speech synthesis uses the device's local TTS engine, not a cloud service.
- The voices that come pre-installed with the OS work without any internet connection.
- Enhanced/downloaded voices also work offline once installed.
- This is a major advantage for AAC use cases (parks, cars, rural areas, grandma's house).

### Limitations

| Limitation | Details |
|-----------|---------|
| Text length | Maximum ~32,767 characters per utterance (browser-dependent) |
| Voice consistency | Different voices on every platform -- no guaranteed voice |
| Voice quality | Robotic compared to cloud neural TTS |
| Safari quirks | getVoices() may return empty; requires voiceschanged event listener |
| Android quirks | Falls back to English if requested voice pack not installed |
| iOS background | Speech stops when Safari goes to background |
| No Siri voices | Apple blocks Siri voices from Web Speech API |
| Rate/Pitch limits | Engines may cap rate/pitch regardless of specified value |
| No SSML | Web Speech API does not support SSML markup |
| No streaming | Cannot stream audio; must wait for full synthesis |

### Browser Compatibility

| Browser | SpeechSynthesis Support |
|---------|------------------------|
| Chrome (Desktop) | YES (since v33) |
| Chrome (Android) | YES (since v33) |
| Safari (iOS) | YES (since iOS 7) |
| Safari (macOS) | YES (since v7) |
| Edge | YES (since v14) |
| Firefox | YES (since v49) |
| Samsung Internet | YES |
| Opera | YES |

**Cost: FREE -- no API keys, no billing, no limits.**

---

## 2. Cloud TTS APIs (Premium Voices)

### 2A. Google Cloud Text-to-Speech

**Voice Types and Pricing (per 1 million characters)**:

| Voice Type | Cost / 1M chars | Free Tier | Quality Level |
|-----------|-----------------|-----------|---------------|
| Standard | $4.00 | 4M chars/month | Basic, older generation |
| WaveNet | $16.00 | 1M chars/month | Good, AI-generated |
| Neural2 | $16.00 | 1M chars/month | Better, improved prosody |
| Studio | $30.00 | None specified | Premium, professional actor + AI |
| Chirp 3 HD | $30.00 | None specified | Newest generation, most natural |

**Voice Count**: 380+ voices across 50+ languages and dialects.

**Key Features**:
- SSML support for fine-grained control (pauses, emphasis, prosody)
- Neural2 voices support speaking styles
- Multiple audio output formats (MP3, OGG, WAV, LINEAR16)
- Low latency for real-time synthesis (~200-500ms for short phrases)

**Latency**: Acceptable for AAC. Short phrases (3-5 words) typically synthesize in 200-500ms. Network round-trip adds variable latency depending on connection.

**Accessibility/Nonprofit Pricing**: No publicly listed special pricing for accessibility or nonprofits. Google Cloud does offer credits for startups and nonprofits through separate programs (Google for Nonprofits, Google for Startups).

**Child Voices**: Limited. No dedicated child voice category in the standard offering.

---

### 2B. Amazon Polly

**Pricing (per 1 million characters)**:

| Voice Type | Cost / 1M chars | Free Tier | Notes |
|-----------|-----------------|-----------|-------|
| Standard | $4.00 | 5M chars/month (indefinite) | Oldest, most robotic |
| Neural (NTTS) | $16.00 | 1M chars/month (12 months) | Good quality |
| Long-Form | $100.00 | 500K chars/month (12 months) | Optimized for long content |
| Generative | $30.00 | 100K chars/month (12 months) | Newest, most natural |

**Voice Count**: 100+ voices across 40+ languages and variants (40 female, 20 male in Standard; expanding in Neural/Generative).

**Key Features**:
- Real-time streaming synthesis (great for AAC latency requirements)
- Speech Marks API for lip-sync / word highlighting
- SSML support
- Cached speech playback incurs NO additional charges (important for cost control)
- Bilingual voices available
- New AWS accounts (after July 2025) get $200 in free tier credits

**Child Voice**: YES -- Amazon Polly has a child US English NTTS voice called **Kevin**. This is specifically designed to sound like a young child, making it one of the few major cloud providers with a dedicated child voice.

**Latency**: Supports real-time streaming, meaning audio can begin playing before full synthesis completes. Excellent for AAC responsiveness.

---

### 2C. Microsoft Azure Speech Service

**Pricing (per 1 million characters)**:

| Voice Type | Cost / 1M chars | Free Tier | Notes |
|-----------|-----------------|-----------|-------|
| Neural (Standard) | $16.00 | 500K chars/month (ongoing) | Good quality |
| Neural HD V2 | $30.00 | Included in F0 tier | Premium quality |
| Long Audio | $100.00 | -- | For bulk/batch content |
| Custom Neural Voice | $24.00 | -- | Requires training + hosting fees |

**Additional Custom Neural Voice Costs**:
- Training: $52/compute hour (up to $4,992 per training)
- Endpoint hosting: $4.04/model/hour (billed per second)
- Long audio creation: $100/1M characters
- Requires application for access (limited access feature)

**Voice Count**: 449+ neural voices across 140+ languages and locales. This is the largest selection of any provider.

**Key Features**:
- Speaking styles (cheerful, empathy, calm, etc.) -- useful for AAC emotional expression
- Speaking roles (same voice, different age/gender)
- Personal Voice: Create a synthetic voice from a user's own voice recordings (powerful for AAC users who are losing speech)
- Custom Neural Voice for brand-specific voices
- Commitment tiers with discounts at 80M, 400M, 2B character levels
- SSML support with extensive controls

**Free Tier**: 500K characters/month for Neural TTS (ongoing, not just 12 months). This is notable -- it's a permanent free tier.

**Child Voices**: Not specifically marketed as "child voices" but speaking style adjustments and role-based voice modification can approximate younger-sounding voices.

**Personal Voice**: Free voice profile creation; synthesis charged at per-character rate; storage billed per 1,000 profiles/month. This is uniquely valuable for AAC -- allows a person to create a voice that sounds like them before they lose speech capability.

---

### 2D. ElevenLabs

**Pricing (Monthly Subscription + Per-Character)**:

| Plan | Monthly Cost | Characters Included | Overage per 1K chars |
|------|-------------|--------------------|--------------------|
| Free | $0 | 10K chars | N/A |
| Starter | $5 | 30K chars | ~$0.17 |
| Creator | $11 | 100K chars | $0.30 |
| Pro | $99 | 500K chars | $0.24 |
| Scale | $330 | 2M chars | $0.18 |
| Business | $1,100 | Custom | $0.12 |

**Effective Cost per 1M Characters** (at plan rate, not overage):
- Starter: ~$167/1M chars
- Creator: ~$110/1M chars
- Pro: ~$198/1M chars
- Scale: ~$165/1M chars
- Business: ~$120/1M chars (estimated)

NOTE: ElevenLabs is dramatically more expensive than Google/Amazon/Azure per character.

**Key Features**:
- Highest perceived voice quality in the market
- Voice cloning from just 3 minutes of audio (Instant Clone)
- Professional Voice Cloning for highest fidelity
- Flash v2.5 model: 75ms latency (fastest in the industry)
- Multilingual v2: highest quality but higher latency
- Emotional range and expressiveness
- 29+ languages

**Child Voices**: ElevenLabs allows creation of young-sounding voices via voice cloning, but does not have a dedicated catalog of child voices. Voice cloning could theoretically capture a child's voice, but raises ethical and consent questions.

**Latency**: Flash v2.5 achieves 75ms -- the fastest of any cloud provider. Excellent for real-time AAC use.

**Verdict for AAC**: Premium quality but cost-prohibitive for a $9.99 one-time purchase app at scale. Would work as a premium upsell or subscription add-on.

---

### 2E. Acapela Group (Used by Proloquo2Go)

**Overview**: Acapela is a European TTS company that specializes in natural-sounding voices, including voices specifically designed for children. They are the TTS provider behind AssistiveWare's Proloquo2Go, the gold-standard AAC app.

**API Availability**: YES -- Acapela Cloud API is available to third parties. They offer:
- Cloud API (real-time synthesis)
- On-device SDK (offline-capable)
- On-premise deployment
- Hybrid deployment options

**Voice Portfolio**: 200+ voices across 30+ languages, including dedicated children's voices.

**Children's Voices**: This is Acapela's standout feature for AAC:
- They were the first company (2012, in partnership with AssistiveWare) to develop genuine text-to-speech children's voices
- Includes voices for different age ranges
- Bi-lingual child voices (e.g., Canadian English/French)
- Neural-quality children's voices available
- Both male and female child voices

**Why AssistiveWare Chose Acapela**:
1. Acapela was willing to invest in creating genuine children's voices -- most other providers only offered adult voices
2. Clinical appropriateness: A 4-year-old AAC user should sound like a 4-year-old, not an adult
3. Quality of voices optimized for short AAC-style utterances
4. "My-Own-Voice" technology lets users create personalized synthetic voices
5. On-device capability for offline use

**Pricing**: Enterprise/custom pricing only. Not publicly listed. Requires contacting Acapela sales directly. Given their niche focus on accessibility and assistive technology, pricing is likely negotiated per deployment model (cloud API, on-device SDK, etc.).

**Verdict for AAC**: The most AAC-appropriate option due to children's voices, but enterprise pricing model makes it difficult to estimate costs for a $9.99 app. Would require a sales conversation.

---

### 2F. OpenAI TTS

**Pricing (per 1 million characters)**:

| Model | Cost / 1M chars | Notes |
|-------|-----------------|-------|
| TTS (tts-1) | $15.00 | Standard quality, lower latency |
| TTS HD (tts-1-hd) | $30.00 | Highest fidelity |
| gpt-4o-mini-tts | ~$0.015/minute | Newer minute-based pricing |

**Voices Available**: 13 voices -- Alloy, Ash, Ballad, Coral, Echo, Fable, Nova, Onyx, Sage, Shimmer, Verse, Marin, Cedar.

**Key Features**:
- Multiple output formats: MP3, Opus, AAC, FLAC, WAV, PCM
- Good multilingual support (English, Spanish, French, German, Italian, Portuguese, Dutch, Polish, Russian, Japanese, Chinese, and more)
- ~500ms latency for tts-1 (standard)
- Simple API -- just a single endpoint
- No free tier

**Child Voices**: None. All 13 voices sound like adults. Some (Nova, Shimmer) are lighter/higher-pitched but still clearly adult voices.

**Latency**: ~500ms for tts-1, slightly higher for tts-1-hd. Acceptable for AAC but not best-in-class.

**Verdict for AAC**: Simple API, good quality, reasonable pricing, but no child voices and no free tier. The minute-based gpt-4o-mini-tts model could be interesting for very short utterances.

---

## 3. Cost Modeling

### Assumptions

- User speaks 50-200 utterances per day (average: 125)
- Average utterance: 3-5 words = ~20 characters average
- Daily characters per user: 125 utterances x 20 chars = 2,500 chars/day
- Monthly characters per user: 2,500 x 30 = 75,000 chars/month
- Yearly characters per user: 75,000 x 12 = 900,000 chars/year

### Scale Scenarios

| Metric | 1,000 Users | 10,000 Users |
|--------|-------------|--------------|
| Monthly chars | 75M chars | 750M chars |
| Yearly chars | 900M chars | 9B chars |

### Monthly Cost by Provider (1,000 Users / 75M chars per month)

| Provider | Voice Type | Cost/1M chars | Monthly Cost | Yearly Cost |
|----------|-----------|---------------|-------------|-------------|
| **Web Speech API** | Built-in | FREE | $0 | $0 |
| **Google Cloud** | Standard | $4 | $300 | $3,600 |
| **Google Cloud** | WaveNet/Neural2 | $16 | $1,200 | $14,400 |
| **Google Cloud** | Studio/Chirp HD | $30 | $2,250 | $27,000 |
| **Amazon Polly** | Standard | $4 | $300 | $3,600 |
| **Amazon Polly** | Neural | $16 | $1,200 | $14,400 |
| **Amazon Polly** | Generative | $30 | $2,250 | $27,000 |
| **Azure** | Neural | $16 | $1,200 | $14,400 |
| **Azure** | Neural HD V2 | $30 | $2,250 | $27,000 |
| **OpenAI** | tts-1 | $15 | $1,125 | $13,500 |
| **OpenAI** | tts-1-hd | $30 | $2,250 | $27,000 |
| **ElevenLabs** | Scale plan | ~$165/1M | $12,375 | $148,500 |

### Monthly Cost by Provider (10,000 Users / 750M chars per month)

| Provider | Voice Type | Cost/1M chars | Monthly Cost | Yearly Cost |
|----------|-----------|---------------|-------------|-------------|
| **Web Speech API** | Built-in | FREE | $0 | $0 |
| **Google Cloud** | Standard | $4 | $3,000 | $36,000 |
| **Google Cloud** | WaveNet/Neural2 | $16 | $12,000 | $144,000 |
| **Amazon Polly** | Neural | $16 | $12,000 | $144,000 |
| **Azure** | Neural | $16 | $12,000 | $144,000 |
| **OpenAI** | tts-1 | $15 | $11,250 | $135,000 |
| **ElevenLabs** | Business | ~$120/1M | $90,000 | $1,080,000 |

### Revenue vs. Cost Analysis

**One-time purchase revenue**:
- 1,000 users x $9.99 = $9,990 total (one-time)
- 10,000 users x $9.99 = $99,900 total (one-time)

**WARNING -- The Math Does Not Work for Cloud TTS on a One-Time Purchase**:

At 1,000 users with Neural-quality cloud TTS ($16/1M chars):
- Monthly TTS cost: $1,200
- Total revenue from sales: $9,990
- **Revenue covers only 8.3 months of TTS costs**
- After that, you're losing money every month forever

At 10,000 users with Neural-quality cloud TTS ($16/1M chars):
- Monthly TTS cost: $12,000
- Total revenue from sales: $99,900
- **Revenue covers only 8.3 months of TTS costs**
- The ratio stays the same regardless of scale

**CRITICAL FINDING**: Cloud TTS as the primary voice engine is financially unsustainable for a one-time purchase app. The ongoing per-character cost will eventually exceed total revenue. You MUST either:
1. Use Web Speech API (free) as the default
2. Add a subscription model for premium cloud voices
3. Use aggressive caching to dramatically reduce API calls
4. Pre-generate and bundle audio files for core vocabulary

### Free Tier Analysis (Can You Survive on Free Tiers?)

| Provider | Free Tier / Month | Users Supported (at 75K chars/user/month) |
|----------|-------------------|-------------------------------------------|
| Google WaveNet/Neural2 | 1M chars | ~13 users |
| Amazon Polly Neural | 1M chars (12 months only) | ~13 users |
| Azure Neural | 500K chars (ongoing) | ~6 users |
| OpenAI | None | 0 users |
| ElevenLabs | 10K chars | ~0.1 users |

Free tiers are useless at any meaningful scale. They are only viable for development and testing.

---

## 4. Hybrid Approach

### Recommended Architecture: Web Speech API Default + Premium Cloud Upgrade

**Tier 1 -- Free (Default)**: Web Speech API
- Works offline (critical for AAC)
- Zero cost at any scale
- Available on all platforms immediately
- Quality is "good enough" for many users
- No API keys, no server infrastructure needed

**Tier 2 -- Premium (Optional Subscription or IAP)**: Cloud TTS
- Offer 2-3 premium cloud voices as a $2.99-4.99/month subscription
- Use Google Neural2 or Amazon Polly Neural ($16/1M chars)
- Cache aggressively to reduce costs
- Subscription model aligns costs with revenue

### How Other AAC Apps Handle TTS

**Proloquo2Go** ($249.99 one-time):
- Bundles Acapela voices on-device (licensed, included in purchase price)
- All voices work offline
- High price point covers voice licensing costs
- No ongoing cloud costs because everything runs locally

**Spoken AAC**:
- Uses device's built-in TTS (Web Speech API equivalent on native)
- No cloud voices

**TouchChat ($299.99)**:
- Bundles Acapela or similar on-device voices
- High price point subsidizes voice licensing
- Offline-first

**TD Snap / LAMP Words for Life**:
- On-device synthesis
- Offline-capable

**Pattern**: Premium AAC apps either charge $100-300+ to cover bundled voice licensing, or use free built-in device voices. None of them rely on per-request cloud TTS for primary speech output.

### Caching Strategies to Reduce API Calls

**Strategy 1: Cache Common Phrases**
- AAC users rely heavily on a core vocabulary of ~200-400 words
- Pre-generate audio for ALL core vocabulary words at app setup time
- Cache in IndexedDB or Cache API
- Estimated one-time cost per user: 400 words x 20 chars = 8,000 chars = $0.13 (at $16/1M)
- This is extremely affordable as a one-time setup cost

**Strategy 2: Cache on First Use**
- Every time a cloud TTS phrase is spoken, cache the audio file
- On repeat use, serve from cache -- zero API cost
- Use a content-addressable cache: hash(text + voice + rate) -> audio blob
- Store in IndexedDB (better for large binary data than Cache API)

**Strategy 3: Pre-Generate Core Vocabulary Audio Pack**
- Generate audio files for the 500 most common AAC words/phrases at build time
- Bundle them with the app (or download on first launch)
- 500 words x 20 chars = 10,000 chars = $0.16 per voice per generation
- For 5 voices: $0.80 total -- trivially cheap
- Ship as a downloadable voice pack

**Strategy 4: Predictive Pre-Caching**
- When the user opens a category (e.g., "Food"), pre-generate audio for all words in that category
- Cache for offline use
- Reduces perceived latency since audio is ready before the user taps

**Estimated Cache Hit Rate for AAC**: 80-95%. AAC users use a relatively small, repetitive vocabulary. After initial caching, the vast majority of utterances would be served from local cache rather than making API calls.

### Cost With Aggressive Caching (80% Cache Hit Rate)

At 1,000 users, Neural TTS ($16/1M chars):
- Without caching: $1,200/month
- With 80% cache hits: $240/month
- With 95% cache hits: $60/month
- With pre-generated core vocab + caching: ~$30-50/month

This makes cloud TTS potentially viable even on a one-time purchase, especially with pre-generated core vocabulary.

---

## 5. Offline Considerations

### Which Options Work Offline?

| Option | Offline Support | Notes |
|--------|----------------|-------|
| Web Speech API | YES | Uses device's built-in TTS engine |
| Google Cloud TTS | NO (but cacheable) | Requires internet for synthesis |
| Amazon Polly | NO (but cacheable) | Requires internet for synthesis |
| Azure Speech | NO (but cacheable) | Has on-device SDK but not for web |
| ElevenLabs | NO (but cacheable) | Requires internet for synthesis |
| OpenAI TTS | NO (but cacheable) | Requires internet for synthesis |
| Acapela | YES (on-device SDK) | Requires native app, not web |

### Caching Cloud Audio for Offline Playback

YES -- cloud-generated audio CAN be cached for offline playback. Strategy:

1. **Generate audio via API** -> receive audio blob (MP3/WAV)
2. **Store in IndexedDB** using text+voice as key
3. **Register in service worker cache** for offline access
4. **On subsequent requests**, check IndexedDB first, then cache, then network

**Implementation approach for the service worker**:
- Intercept TTS API requests in the service worker
- Check IndexedDB for cached audio matching the text+voice combo
- If found, return cached audio (zero latency, zero cost)
- If not found, fetch from API, cache the response, return audio
- Network-first for new phrases, cache-first for repeated phrases

**Storage Considerations**:
- Average MP3 for a 3-5 word phrase: ~10-30 KB
- 500 cached phrases: ~5-15 MB
- 2,000 cached phrases: ~20-60 MB
- IndexedDB storage limit: ~50MB minimum guaranteed, often much more
- This is well within reasonable limits for an AAC app

### Offline-First Architecture for AAC

The recommended approach is:

1. **Primary**: Web Speech API (always available offline)
2. **Enhanced**: Cloud TTS with aggressive caching (available offline after first use)
3. **Fallback chain**: Cached cloud audio -> Web Speech API -> stored audio files

This ensures the child can ALWAYS communicate, regardless of internet connectivity. The app should NEVER fail to produce speech output.

---

## 6. Child-Appropriate Voices

### Why This Matters for AAC

A 4-year-old child using an AAC device to communicate should ideally sound like a 4-year-old child, not a 40-year-old adult. Identity and voice are deeply connected -- using an age-inappropriate voice can:
- Feel alienating for the child
- Sound jarring to communication partners
- Reduce social acceptance
- Undermine the child's sense of self-expression

Research in AAC consistently shows that voice personalization (including age-appropriate voices) improves device adoption and social outcomes.

### Provider Comparison for Child Voices

| Provider | Dedicated Child Voices | Details |
|----------|----------------------|---------|
| **Acapela** | YES -- industry leader | First to create genuine children's TTS (2012). Multiple age ranges, bilingual options, neural quality. Gold standard for AAC. |
| **Amazon Polly** | YES -- one voice | "Kevin" -- child US English NTTS voice. Limited to one voice/language but it exists. |
| **Google Cloud** | NO | No dedicated child voice category. Could approximate with pitch adjustment. |
| **Azure** | PARTIAL | No dedicated child voices, but speaking style/role adjustments can approximate younger sound. |
| **ElevenLabs** | CLONEABLE | No catalog child voices, but voice cloning could theoretically create one from a child's audio sample. Ethical/consent concerns. |
| **OpenAI** | NO | All 13 voices are adult-sounding. Nova and Shimmer are lighter but still adult. |
| **Web Speech API** | PLATFORM-DEPENDENT | No guaranteed child voice. Some platforms may have one in system settings. |

### Other Child Voice TTS Providers

- **SpeechGen**: Multiple child voices -- Kevin (8-12 boy), Justin (7-11 boy), Anny (4-8 girl), Ivy (7-11 girl), Maisie (4-8 girl British)
- **Narakeet**: 37 child voices in 10 languages
- **Respeecher**: AI-powered kids' voice generator
- **TopMediai**: Multiple kid and baby voice options

These are mostly consumer/content-creation tools, not necessarily enterprise APIs suitable for embedding in a production AAC app. Would require evaluation of their API terms, reliability, and pricing.

### Pitch Adjustment as a Workaround

The Web Speech API supports `utterance.pitch` (0.0 to 2.0, default 1.0). Increasing pitch can make an adult voice sound younger, but:
- Results are unconvincing -- sounds like a sped-up adult, not a real child
- Prosody, rhythm, and speech patterns are still adult-like
- Not a substitute for a genuine child voice model
- May work as a "better than nothing" option with Web Speech API

---

## 7. Recommendations

### For the AAC Board PWA ($9.99 One-Time Purchase)

**PRIMARY RECOMMENDATION: Hybrid Approach**

**Phase 1 (Launch)**:
- Use Web Speech API as the default TTS engine
- FREE, offline-capable, works on all platforms
- Let users select from available system voices
- Implement voice selection UI with pitch/rate adjustment
- Store voice preferences in localStorage/IndexedDB

**Phase 2 (Enhancement)**:
- Pre-generate audio files for the core vocabulary (~200-500 words) using Amazon Polly Neural or Google Neural2
- Bundle these as downloadable "voice packs" (~5-15 MB each)
- Include the Amazon Polly "Kevin" child voice as the first premium voice pack
- One-time generation cost is trivially cheap (~$0.08-0.16 per voice)
- These work offline once downloaded

**Phase 3 (Premium -- Subscription)**:
- Offer real-time cloud TTS as a $2.99-4.99/month subscription ("Premium Voices")
- Use Amazon Polly Neural or Google Neural2 ($16/1M chars)
- Implement aggressive caching (80-95% hit rate expected)
- With caching, cost per user is likely $0.50-2.00/month
- Subscription revenue covers ongoing cloud costs

### Provider Ranking for AAC Use Case

1. **Amazon Polly Neural** -- Best overall for AAC
   - Has a child voice (Kevin)
   - Real-time streaming (low latency)
   - $16/1M chars (competitive)
   - Generous free tier
   - Cached playback is free
   - AWS infrastructure is reliable

2. **Google Cloud Neural2** -- Strong second choice
   - 380+ voices, 50+ languages
   - $16/1M chars
   - Good free tier (1M chars/month)
   - No child voice is a drawback

3. **Microsoft Azure** -- Best for Personal Voice feature
   - 449+ voices, 140+ languages (largest selection)
   - Personal Voice feature is uniquely valuable for AAC users losing speech
   - Permanent free tier (500K chars/month)
   - $16/1M chars
   - Speaking styles add emotional expression

4. **Acapela** -- Best voice quality for AAC but enterprise pricing
   - Contact sales for pricing
   - Best children's voices in the industry
   - On-device SDK available (but may not work in PWA context)
   - Used by the gold standard (Proloquo2Go)

5. **OpenAI TTS** -- Simple but no child voices
   - $15/1M chars
   - Simple API
   - No free tier
   - No child voices

6. **ElevenLabs** -- Too expensive for this use case
   - Best quality but $120-165/1M chars effectively
   - Voice cloning is interesting but not needed at launch
   - Cost-prohibitive for a $9.99 app

### Key Architectural Decisions

1. **Web Speech API must always be available as fallback** -- never leave a child without a voice
2. **Cache everything** -- AAC vocabulary is repetitive; first-use caching will dramatically reduce costs
3. **Pre-generate core vocabulary** -- trivially cheap, enables offline premium voices
4. **Subscription for real-time cloud TTS** -- one-time purchase cannot sustain per-request cloud costs
5. **Voice selection should be simple** -- parents are overwhelmed; don't show 400 voices, curate 5-10 good ones

---

## Sources

- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [SpeechSynthesis - MDN](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
- [Web Speech Recommended Voices (GitHub)](https://github.com/HadrienGardeur/web-speech-recommended-voices)
- [State of Speech Synthesis in Safari](https://weboutloud.io/bulletin/speech_synthesis_in_safari/)
- [Apple Developer Forums - Web Speech API](https://developer.apple.com/forums/thread/723503)
- [Google Cloud TTS Pricing](https://cloud.google.com/text-to-speech/pricing)
- [Google Cloud TTS Voices](https://docs.google.com/text-to-speech/docs/list-voices-and-types)
- [Amazon Polly Pricing](https://aws.amazon.com/polly/pricing/)
- [Amazon Polly Child Voice (Kevin)](https://aws.amazon.com/blogs/machine-learning/amazon-polly-launches-a-child-us-english-ntts-voice/)
- [Azure Speech Services Pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/speech-services/)
- [Azure Speech Language Support](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support)
- [ElevenLabs Pricing](https://elevenlabs.io/pricing)
- [ElevenLabs API Pricing](https://elevenlabs.io/pricing/api)
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)
- [Acapela Group](https://www.acapela-group.com)
- [Acapela Children's Voices](https://www.acapela-group.com/voices/children-voices/)
- [Proloquo2Go - AssistiveWare](https://www.assistiveware.com/products/proloquo2go)
- [Speech Central Cached Cloud Audio](https://speechcentral.net/2026/01/10/speech-central-introduces-cached-cloud-audio-for-cost-free-offline-ai-text-to-speech/)
- [Best TTS APIs 2026 - Speechmatics](https://www.speechmatics.com/company/articles-and-news/best-tts-apis-in-2025-top-12-text-to-speech-services-for-developers)
- [Best TTS APIs 2026 - Deepgram](https://deepgram.com/learn/best-text-to-speech-apis-2026)
- [PWA Offline Caching Strategies](https://www.magicbell.com/blog/offline-first-pwas-service-worker-caching-strategies)
- [Chrome Audio Caching](https://developer.chrome.com/blog/ump/)
