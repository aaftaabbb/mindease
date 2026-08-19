const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

app.set('trust proxy', 1);

// Manual CORS middleware — must be FIRST
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean);
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  next();
});

app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  res.setTimeout(10000, () => {
    if (!res.headersSent) {
      res.status(504).json({ msg: 'Request timeout, please try again' });
    }
  });
  next();
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: 'Too many requests, please try again later.' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { msg: 'Too many auth attempts, please try again later.' }
});

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  message: { msg: 'Too many messages, please slow down.' }
});

app.use(generalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/chat', chatLimiter);

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/chat',     require('./routes/chat'));
app.use('/api/mood',     require('./routes/mood'));
app.use('/api/journal',  require('./routes/journal'));
app.use('/api/clinic',   require('./routes/clinic'));
app.use('/api/booking',  require('./routes/booking'));
app.use('/api/articles', require('./routes/article'));
app.use('/api/admin',    require('./routes/admin'));

mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
})
  .then(async () => {
    console.log('MongoDB Connected');
    await seedData();
  })
  .catch(err => console.log('DB Error:', err));

async function seedData() {
  const Clinic = require('./models/Clinic');
  const User = require('./models/User');
  const Article = require('./models/Article');
  const bcrypt = require('bcryptjs');
  
  const clinicCount = await Clinic.countDocuments();
  if (clinicCount === 0) {
    await Clinic.insertMany([
      { name: 'iCall TISS',            city: 'Mumbai',    phone: '9152987821',  type: 'helpline'     },
      { name: 'Vandrevala Foundation', city: 'Pan India', phone: '18602662345', type: 'helpline'     },
      { name: 'NIMHANS',               city: 'Bangalore', phone: '08046110007', type: 'clinic'       },
      { name: 'Fortis Mental Health',  city: 'Delhi',     phone: '8376804102',  type: 'psychiatrist' },
      { name: 'Mpower',                city: 'Mumbai',    phone: '18001208200', type: 'counselor'    }
    ]);
    console.log('Clinics seeded');
  }

  const articleCount = await Article.countDocuments();
  const hasOldArticles = await Article.findOne({ slug: 'understanding-anxiety' });
  if (hasOldArticles) {
    await Article.deleteMany({});
    console.log('Old articles cleared');
  }
  if (articleCount === 0 || hasOldArticles) {
    await Article.insertMany([
      {
        title: 'Anxiety in College: What NIMH Wants You to Know',
        slug: 'anxiety-nimh-guide',
        category: 'anxiety',
        excerpt: 'According to the National Institute of Mental Health, about one third of U.S. adolescents and adults experience an anxiety disorder at some point in their lives. Here\'s what the science says.',
        content: `<p><em>Based on information from the National Institute of Mental Health (NIMH) and peer-reviewed research.</em></p>

<h2>What the Research Shows</h2>
<p>Anxiety disorders are the most common mental illness in the U.S., affecting 40 million adults. According to NIMH, anxiety disorder symptoms can interfere with daily life and routine activities, including job performance, schoolwork, and relationships. In severe cases, a person might feel intense fear in common situations or avoid social encounters entirely.</p>

<h2>Signs You Shouldn't Ignore</h2>
<p>NIMH identifies these as common symptoms of anxiety disorders:</p>
<ul>
<li>Feeling restless, keyed up, or on edge</li>
<li>Being easily fatigued</li>
<li>Difficulty concentrating or mind going blank</li>
<li>Irritability</li>
<li>Muscle tension</li>
<li>Sleep disturbance (difficulty falling or staying asleep)</li>
</ul>
<p>These symptoms must be present for at least six months to meet diagnostic criteria for Generalized Anxiety Disorder.</p>

<h2>What Actually Helps (Evidence-Based)</h2>
<p>The NIMH recommends several approaches backed by research:</p>
<p><strong>Psychotherapy:</strong> Cognitive Behavioral Therapy (CBT) is considered the gold standard. CBT helps you identify and change negative thought patterns. Research published in the journal <em>Cognitive Behaviour Therapy</em> (2018) found that increased skills usage statistically mediates symptom reduction in self-guided CBT.</p>
<p><strong>Medication:</strong> SSRIs and SNRIs are commonly prescribed. Always consult a healthcare provider.</p>
<p><strong>Lifestyle Changes:</strong> NIMH specifically recommends exercise, maintaining sleep routine, limiting caffeine, and reaching out to friends or family members.</p>

<h2>Coping Strategies You Can Start Today</h2>
<ol>
<li><strong>4-7-8 Breathing:</strong> Inhale 4 seconds → Hold 7 seconds → Exhale 8 seconds. Repeat 4 times.</li>
<li><strong>5-4-3-2-1 Grounding:</strong> Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.</li>
<li><strong>Challenge Your Thoughts:</strong> Ask — "Is there proof to support this worry? Could there be another explanation?"</li>
<li><strong>Limit Caffeine:</strong> Caffeine has a 6-hour half-life and can mimic anxiety symptoms.</li>
</ol>

<h2>When to Seek Help</h2>
<p>If your anxiety is interfering with daily life, it's time to talk to a professional. Psychotherapy and medication are the two main treatments, and many people benefit from a combination of both.</p>

<p><strong>Source:</strong> National Institute of Mental Health. "Anxiety Disorders." NIMH, last reviewed December 2024. <a href="https://www.nimh.nih.gov/health/topics/anxiety-disorders" target="_blank">nimh.nih.gov</a></p>
<p><strong>Helpline:</strong> If you're in immediate distress, call or text <strong>988</strong> (Suicide & Crisis Lifeline).</p>`,
        readTime: 5, tags: ['anxiety', 'NIMH', 'evidence-based', 'CBT', 'students'], featured: true
      },
      {
        title: 'Depression Is Not Sadness: What the APA Wants You to Understand',
        slug: 'depression-apa-understanding',
        category: 'depression',
        excerpt: 'The American Psychological Association emphasizes that depression is a medical condition — not a character flaw. Over 280 million people worldwide are affected.',
        content: `<p><em>Based on publications from the American Psychological Association (APA) and the World Health Organization (WHO).</em></p>

<h2>Depression by the Numbers</h2>
<p>According to WHO, depression is a common mental disorder. Globally, more than 280 million people suffer from it. The APA's Clinical Practice Guideline (2019) notes that depression is one of the leading causes of disability worldwide.</p>

<h2>It's Not Just "Feeling Sad"</h2>
<p>Depression is a persistent change in brain chemistry that affects:</p>
<ul>
<li><strong>Mood:</strong> Persistent sadness, emptiness, or hopelessness</li>
<li><strong>Interest:</strong> Loss of pleasure in activities you once enjoyed</li>
<li><strong>Energy:</strong> Fatigue and decreased motivation</li>
<li><strong>Sleep:</strong> Insomnia or sleeping too much</li>
<li><strong>Appetite:</strong> Significant weight changes</li>
<li><strong>Concentration:</strong> Difficulty thinking, focusing, or making decisions</li>
<li><strong>Self-worth:</strong> Excessive guilt or worthlessness</li>
</ul>

<h2>What the APA Recommends</h2>
<p>The APA's 2019 Clinical Practice Guideline for the Treatment of Depression recommends:</p>
<ol>
<li><strong>For mild depression:</strong> Consider psychotherapy (CBT or IPT) before medication</li>
<li><strong>For moderate-severe depression:</strong> Combination of antidepressant medication and psychotherapy</li>
<li><strong>Physical activity:</strong> Studies show exercise reduces risk of depressive symptoms consistently across ages and cultures</li>
<li><strong>Nutrition:</strong> Increase fruits, vegetables, whole grains, nuts, and omega-3 rich foods. Limit processed foods.</li>
</ol>

<h2>Breaking the Stigma</h2>
<p>Research published in <em>JAMA Psychiatry</em> (2020) found that an online guided self-help program based on CBT reduced the risk of major depression by 52% in high-risk individuals. Treatment works.</p>

<h2>Indian Context</h2>
<p>In India, depression affects approximately 5% of the adult population. However, stigma prevents many from seeking help. The Indian Psychiatric Society estimates that 80-90% of people with depression in India don't receive treatment.</p>

<p><strong>Sources:</strong></p>
<ul>
<li>American Psychological Association. "Clinical Practice Guideline for the Treatment of Depression." APA, 2019.</li>
<li>WHO. "Depressive Disorder (Depression) Fact Sheet." August 2025.</li>
<li>Sander, L.B. et al. "Effectiveness of a Guided Web-Based Self-help Intervention to Prevent Depression." <em>JAMA Psychiatry</em>, 2020.</li>
</ul>
<p><strong>Helpline:</strong> Vandrevala Foundation: 1860-266-2345 | iCall: 9152987821</p>`,
        readTime: 6, tags: ['depression', 'APA', 'WHO', 'evidence-based', 'treatment'], featured: true
      },
      {
        title: 'The NIMH Stress Fact Sheet: What Every Indian Student Should Read',
        slug: 'nimh-stress-fact-sheet',
        category: 'stress',
        excerpt: 'NIMH\'s "I\'m So Stressed Out!" fact sheet translated for Indian students — with practical strategies that actually work.',
        content: `<p><em>Adapted from the National Institute of Mental Health (NIMH) fact sheet "I'm So Stressed Out!" (NIH Publication No. 20-MH-8125).</em></p>

<h2>Is It Stress or Anxiety?</h2>
<p>NIMH explains that stress is a response to a threat in a situation, while anxiety is a reaction to the stress. In small amounts, stress can be helpful — it pushes you to meet deadlines. But chronic stress leads to health problems.</p>

<h2>Physical Effects of Chronic Stress</h2>
<p>Research shows prolonged stress can cause:</p>
<ul>
<li>Headaches and muscle tension</li>
<li>Stomach problems and digestive issues</li>
<li>Weakened immune system</li>
<li>High blood pressure</li>
<li>Sleep disturbances</li>
<li>Increased risk of heart disease</li>
</ul>

<h2>NIMH's Recommended Coping Strategies</h2>
<p>These are directly from NIMH's evidence-based recommendations:</p>
<ol>
<li><strong>Download a relaxation app</strong> — NIMH specifically recommends apps for deep breathing or mindfulness meditation</li>
<li><strong>Exercise regularly</strong> — Even 30 minutes of walking makes a measurable difference</li>
<li><strong>Eat healthy, regular meals</strong> — Your brain needs proper nutrition to manage stress hormones</li>
<li><strong>Stick to a sleep routine</strong> — Same bedtime and wake time, even on weekends</li>
<li><strong>Limit caffeine</strong> — Soft drinks, coffee, and energy drinks increase cortisol</li>
<li><strong>Identify and challenge negative thoughts</strong> — Core CBT technique</li>
<li><strong>Reach out to friends or family</strong> — Social connection is protective against stress</li>
</ol>

<h2>Indian Student Stress: The Real Picture</h2>
<p>A 2023 study published in <em>Healthcare</em> (MDPI) found that academic pressure is the #1 stressor for Indian college students, followed by career uncertainty and financial burden. The Indian education system's emphasis on marks over learning compounds this.</p>

<h2>When to Get Help</h2>
<p>NIMH states: "If you are struggling to cope, or the symptoms of your stress or anxiety won't go away, it may be time to talk to a professional. Psychotherapy and medication are the two main treatments."</p>

<p><strong>Source:</strong> NIMH. "I'm So Stressed Out! Fact Sheet." NIH Publication No. 20-MH-8125. <a href="https://www.nimh.nih.gov/health/publications/so-stressed-out-fact-sheet" target="_blank">nimh.nih.gov</a></p>`,
        readTime: 5, tags: ['stress', 'NIMH', 'students', 'evidence-based', 'coping'], featured: false
      },
      {
        title: 'CBT Techniques You Can Use Right Now: A Student\'s Guide',
        slug: 'cbt-techniques-students',
        category: 'mindfulness',
        excerpt: 'Cognitive Behavioral Therapy is the most researched therapy in the world. Here are techniques from published clinical guidelines you can practice today.',
        content: `<p><em>Based on CBT techniques from the APA Clinical Practice Guidelines and research published in peer-reviewed journals.</em></p>

<h2>What Is CBT?</h2>
<p>Cognitive Behavioral Therapy (CBT) is a structured, evidence-based psychotherapy that helps you identify and change unhelpful thinking patterns and behaviors. It's the most researched form of therapy, with over 2,000 clinical trials supporting its effectiveness.</p>

<h2>Technique 1: The Thought Record</h2>
<p>When you feel anxious or sad, write down:</p>
<ol>
<li><strong> Situation:</strong> What happened?</li>
<li><strong>Thought:</strong> What went through your mind?</li>
<li><strong>Emotion:</strong> What did you feel? (Rate intensity 0-100)</li>
<li><strong>Evidence For:</strong> What supports this thought?</li>
<li><strong>Evidence Against:</strong> What contradicts it?</li>
<li><strong>Balanced Thought:</strong> A more realistic view</li>
<li><strong>Emotion After:</strong> Re-rate (0-100)</li>
</ol>

<h2>Technique 2: Worst Case / Best Case / Most Likely</h2>
<p>From Council for Relationships therapist Lia Pezzato, MFT:</p>
<ul>
<li>What's the <strong>worst</strong> that could happen?</li>
<li>What's the <strong>best</strong> possible outcome?</li>
<li>What's the <strong>most likely</strong> scenario?</li>
</ul>
<p>This technique breaks the cycle of catastrophic thinking that fuels anxiety.</p>

<h2>Technique 3: Behavioral Activation</h2>
<p>Research shows that when you're depressed or anxious, your instinct is to withdraw — but isolation makes it worse. Behavioral activation means scheduling activities even when you don't feel like it:</p>
<ul>
<li>Start with activities that give you a sense of <strong>pleasure</strong> or <strong>mastery</strong></li>
<li>Start ridiculously small — even 5 minutes counts</li>
<li>Track your mood before and after each activity</li>
</ul>

<h2>Technique 4: Progressive Muscle Relaxation</h2>
<p>Systematically tense and release each muscle group for 5-10 seconds, starting from your toes and moving up to your head. This technique has been shown to reduce cortisol levels in multiple clinical studies.</p>

<h2>The Evidence</h2>
<p>A meta-analysis published in <em>Cognitive Behaviour Therapy</em> (2018) found that CBT-based interventions are effective for reducing anxiety and depression in university students, with effects sustained over time. WHO also recommends CBT as a first-line treatment for common mental health conditions.</p>

<p><strong>Sources:</strong></p>
<ul>
<li>APA Clinical Practice Guideline for the Treatment of Depression, 2019</li>
<li>Terides, M.D. et al. "Increased skills usage statistically mediates symptom reduction in self-guided internet-delivered CBT." <em>Cognitive Behaviour Therapy</em>, 47(1), 43-61.</li>
<li>Pezzato, L. "Managing Anxiety & Burnout: Mental Health Tips for College Students." Council for Relationships, 2024.</li>
</ul>`,
        readTime: 6, tags: ['CBT', 'therapy', 'evidence-based', 'mindfulness', 'techniques'], featured: true
      },
      {
        title: 'Sleep Science for Students: What Research Actually Says',
        slug: 'sleep-science-students',
        category: 'sleep',
        excerpt: 'Your brain consolidates memories and processes emotions during sleep. Here\'s what neuroscience and the Sleep Research Society recommend.',
        content: `<p><em>Based on sleep research from the National Sleep Foundation, NIH, and peer-reviewed studies.</em></p>

<h2>Why Sleep Is Non-Negotiable</h2>
<p>Research from the National Institutes of Health shows that sleep is when your brain:</p>
<ul>
<li>Consolidates memories from the day (critical for learning)</li>
<li>Processes emotions and emotional experiences</li>
<li>Clears toxins from the brain (including beta-amyloid, linked to Alzheimer's)</li>
<li>Repairs cells and tissues</li>
</ul>
<p>A single night of poor sleep impairs cognitive function as much as being legally drunk.</p>

<h2>The College Sleep Crisis</h2>
<p>According to the American Academy of Sleep Medicine, <strong>more than 60% of college students report poor sleep quality</strong>. The consequences are serious:</p>
<ul>
<li>Lower GPA (research links sleep to academic performance)</li>
<li>Increased anxiety and depression symptoms</li>
<li>Weakened immune function</li>
<li>Weight gain and metabolic issues</li>
</ul>

<h2>Evidence-Based Sleep Hygiene</h2>
<p>These recommendations come from the Sleep Research Society and National Sleep Foundation:</p>
<ol>
<li><strong>Consistent Schedule:</strong> Same bed and wake time every day (±30 minutes), including weekends. This is the single most impactful change.</li>
<li><strong>Screen Curfew:</strong> No screens 1 hour before bed. Blue light suppresses melatonin production by up to 50% (Harvard Health).</li>
<li><strong>Cool Temperature:</strong> Ideal sleeping temperature is 18-20°C (65-68°F). Your body needs to cool down to initiate sleep.</li>
<li><strong>Caffeine Cutoff:</strong> No caffeine after 2 PM. Caffeine's half-life is 5-6 hours — meaning half is still in your system at bedtime.</li>
<li><strong>Alcohol Myth:</strong> Alcohol may help you fall asleep faster, but it destroys sleep quality, especially REM sleep.</li>
<li><strong>Light Exposure:</strong> Get bright light (ideally sunlight) within 30 minutes of waking. This sets your circadian rhythm.</li>
</ol>

<h2>The 20-Minute Rule</h2>
<p>Can't fall asleep after 20 minutes? Get up. Do something boring in dim light. Return to bed when sleepy. This prevents your brain from associating bed with frustration.</p>

<h2>Napping Guidelines</h2>
<p>If you nap, keep it to 20 minutes maximum, before 3 PM. Longer naps interfere with nighttime sleep.</p>

<p><strong>Sources:</strong></p>
<ul>
<li>National Institute of Neurological Disorders and Stroke. "Brain Basics: Understanding Sleep."</li>
<li>Hale, L. & Guan, S. "Screen time and sleep among school-aged children and adolescents." <em>Sleep Medicine Reviews</em>, 2015.</li>
<li>American Academy of Sleep Medicine. "College Students and Sleep." 2023.</li>
</ul>`,
        readTime: 5, tags: ['sleep', 'science', 'students', 'evidence-based', 'health'], featured: false
      },
      {
        title: 'Self-Care Isn\'t a Buzzword: WHO and APA Guidelines on Daily Wellness',
        slug: 'self-care-who-apa-guidelines',
        category: 'self-care',
        excerpt: 'The WHO defines self-care as the ability to promote health and prevent disease. Here are evidence-based daily habits from major health organizations.',
        content: `<p><em>Based on WHO Self-Care Guidelines and APA recommendations for lifestyle mental health.</em></p>

<h2>WHO's Definition of Self-Care</h2>
<p>The World Health Organization defines self-care as "the ability of individuals, families, and communities to promote health, prevent disease, maintain health, and cope with illness and disability with or without the support of a health worker." It's not indulgent — it's essential.</p>

<h2>The Big 5 (Backed by Research)</h2>

<h3>1. Movement</h3>
<p>The APA recommends regular physical activity as a primary intervention for both preventing and managing depression and anxiety. You don't need a gym:</p>
<ul>
<li>10-minute brisk walk boosts mood for up to 2 hours (Anxiety & Depression Association of America)</li>
<li>150 minutes of moderate exercise per week reduces depression risk by 26%</li>
<li>Even yoga has demonstrated effects comparable to CBT in some studies</li>
</ul>

<h3>2. Nutrition</h3>
<p>The WHO and APA both emphasize nutrition's role in mental health:</p>
<ul>
<li>Increase: fruits, vegetables, whole grains, nuts, seeds, omega-3 rich foods (fish, flaxseeds)</li>
<li>Decrease: processed foods, fast food, excess sugar, alcohol</li>
<li>The SMILES trial (2017) showed a Mediterranean diet intervention significantly reduced depression symptoms</li>
</ul>

<h3>3. Hydration</h3>
<p>Even mild dehydration (1-2%) causes fatigue, headaches, and impaired concentration. Aim for 2-3 liters daily.</p>

<h3>4. Social Connection</h3>
<p>Research by Julianne Holt-Lunstad found that strong social connections increase survival odds by 50%. Loneliness is as harmful as smoking 15 cigarettes daily. Even brief, positive interactions count.</p>

<h3>5. Sleep</h3>
<p>Non-negotiable 7-9 hours. The research is overwhelming: poor sleep is both a symptom and cause of mental health problems.</p>

<h2>Building Habits That Actually Stick</h2>
<p>Research on habit formation (Phillippa Lally, UCL, 2009) shows it takes an average of 66 days for a new behavior to become automatic. Key findings:</p>
<ul>
<li>Start ridiculously small — "I'll do 5 pushups" not "I'll work out for an hour"</li>
<li>Stack new habits onto existing ones ("After brushing teeth, I'll journal for 2 minutes")</li>
<li>Missing one day doesn't break the chain — just don't miss two in a row</li>
</ul>

<h2>When Self-Care Feels Impossible</h2>
<p>On bad days, self-care might just be drinking water, taking your medication, or getting out of bed. That counts. The WHO recognizes that self-care looks different depending on your circumstances.</p>

<p><strong>Sources:</strong></p>
<ul>
<li>WHO. "Self-Care Intervention Guidelines." 2022.</li>
<li>APA. "Lifestyle to Support Mental Health." psychiatry.org.</li>
<li>Jacka, F.N. et al. "A randomised controlled trial of dietary improvement for adults with major depression (the 'SMILES' trial)." <em>BMC Medicine</em>, 2017.</li>
<li>Lally, P. et al. "How are habits formed: Modelling habit formation in the real world." <em>European Journal of Social Psychology</em>, 2009.</li>
</ul>`,
        readTime: 7, tags: ['self-care', 'WHO', 'APA', 'habits', 'evidence-based', 'wellness'], featured: true
      }
    ]);
    console.log('Articles seeded');
  }
  
  const adminPhone = process.env.ADMIN_PHONE || '9999999999';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';
  
  const adminExists = await User.findOne({ phone: adminPhone });
  if (!adminExists) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: 'Admin',
      phone: adminPhone,
      password: hashed,
      role: 'admin',
      isVerified: true
    });
    console.log('Admin seeded from environment variables');
  }
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port ' + PORT));
