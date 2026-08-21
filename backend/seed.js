module.exports = async function seedData() {
  const Clinic = require('./models/Clinic');
  const User = require('./models/User');
  const Article = require('./models/Article');

  try {
    const clinicCount = await Clinic.countDocuments();
    if (clinicCount === 0) {
      await Clinic.insertMany([
        { name: 'iCall TISS', city: 'Mumbai', phone: '9152987821', type: 'helpline' },
        { name: 'Vandrevala Foundation', city: 'Pan India', phone: '18602662345', type: 'helpline' },
        { name: 'NIMHANS', city: 'Bangalore', phone: '08046110007', type: 'clinic' },
        { name: 'Fortis Mental Health', city: 'Delhi', phone: '8376804102', type: 'psychiatrist' },
        { name: 'Mpower', city: 'Mumbai', phone: '18001208200', type: 'counselor' }
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
          excerpt: 'According to the National Institute of Mental Health, about one third of U.S. adolescents and adults experience an anxiety disorder at some point in their lives.',
          content: '<p><em>Based on information from the National Institute of Mental Health (NIMH) and peer-reviewed research.</em></p><h2>What the Research Shows</h2><p>Anxiety disorders are the most common mental illness in the U.S., affecting 40 million adults. According to NIMH, anxiety disorder symptoms can interfere with daily life and routine activities, including job performance, schoolwork, and relationships.</p><h2>Signs You Shouldn\'t Ignore</h2><ul><li>Feeling restless, keyed up, or on edge</li><li>Being easily fatigued</li><li>Difficulty concentrating or mind going blank</li><li>Irritability</li><li>Muscle tension</li><li>Sleep disturbance</li></ul><h2>What Actually Helps (Evidence-Based)</h2><p><strong>Psychotherapy:</strong> CBT is considered the gold standard. <strong>Medication:</strong> SSRIs and SNRIs are commonly prescribed. <strong>Lifestyle:</strong> Exercise, sleep routine, limit caffeine, reach out to friends.</p><h2>Coping Strategies</h2><ol><li><strong>4-7-8 Breathing:</strong> Inhale 4s, Hold 7s, Exhale 8s</li><li><strong>5-4-3-2-1 Grounding:</strong> 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste</li><li><strong>Challenge Your Thoughts:</strong> Ask — is there proof to support this worry?</li><li><strong>Limit Caffeine:</strong> 6-hour half-life, mimics anxiety symptoms</li></ol><p><strong>Source:</strong> NIMH. "Anxiety Disorders." nimh.nih.gov</p>',
          readTime: 5, tags: ['anxiety', 'NIMH', 'evidence-based', 'CBT', 'students'], featured: true
        },
        {
          title: 'Depression Is Not Sadness: What the APA Wants You to Understand',
          slug: 'depression-apa-understanding',
          category: 'depression',
          excerpt: 'The American Psychological Association emphasizes that depression is a medical condition — not a character flaw. Over 280 million people worldwide are affected.',
          content: '<p><em>Based on publications from the American Psychological Association (APA) and the World Health Organization (WHO).</em></p><h2>Depression by the Numbers</h2><p>According to WHO, depression is a common mental disorder. Globally, more than 280 million people suffer from it.</p><h2>It\'s Not Just "Feeling Sad"</h2><ul><li><strong>Mood:</strong> Persistent sadness, emptiness, or hopelessness</li><li><strong>Interest:</strong> Loss of pleasure in activities you once enjoyed</li><li><strong>Energy:</strong> Fatigue and decreased motivation</li><li><strong>Sleep:</strong> Insomnia or sleeping too much</li><li><strong>Concentration:</strong> Difficulty thinking, focusing, or making decisions</li></ul><h2>What the APA Recommends</h2><ol><li>For mild depression: Consider psychotherapy (CBT or IPT) before medication</li><li>For moderate-severe: Combination of medication and psychotherapy</li><li>Physical activity reduces risk of depressive symptoms</li><li>Nutrition: Increase fruits, vegetables, whole grains, omega-3 rich foods</li></ol><p><strong>Sources:</strong> APA Clinical Practice Guideline, 2019. WHO Depressive Disorder Fact Sheet.</p>',
          readTime: 6, tags: ['depression', 'APA', 'WHO', 'evidence-based', 'treatment'], featured: true
        },
        {
          title: 'The NIMH Stress Fact Sheet: What Every Indian Student Should Read',
          slug: 'nimh-stress-fact-sheet',
          category: 'stress',
          excerpt: 'NIMH\'s "I\'m So Stressed Out!" fact sheet translated for Indian students — with practical strategies that actually work.',
          content: '<p><em>Adapted from NIMH fact sheet "I\'m So Stressed Out!" (NIH Publication No. 20-MH-8125).</em></p><h2>Is It Stress or Anxiety?</h2><p>Stress is a response to a threat, while anxiety is a reaction to the stress. In small amounts, stress can be helpful — it pushes you to meet deadlines.</p><h2>Physical Effects of Chronic Stress</h2><ul><li>Headaches and muscle tension</li><li>Stomach problems and digestive issues</li><li>Weakened immune system</li><li>Sleep disturbances</li></ul><h2>NIMH\'s Coping Strategies</h2><ol><li>Download a relaxation app</li><li>Exercise regularly — even 30 minutes of walking</li><li>Eat healthy, regular meals</li><li>Stick to a sleep routine</li><li>Limit caffeine</li><li>Identify and challenge negative thoughts</li><li>Reach out to friends or family</li></ol><p><strong>Source:</strong> NIMH. "I\'m So Stressed Out!" nimh.nih.gov</p>',
          readTime: 5, tags: ['stress', 'NIMH', 'students', 'evidence-based', 'coping'], featured: false
        },
        {
          title: 'CBT Techniques You Can Use Right Now: A Student\'s Guide',
          slug: 'cbt-techniques-students',
          category: 'mindfulness',
          excerpt: 'Cognitive Behavioral Therapy is the most researched therapy in the world. Here are techniques you can practice today.',
          content: '<p><em>Based on CBT techniques from the APA Clinical Practice Guidelines.</em></p><h2>What Is CBT?</h2><p>Cognitive Behavioral Therapy helps you identify and change unhelpful thinking patterns and behaviors. Over 2,000 clinical trials support its effectiveness.</p><h2>Technique 1: The Thought Record</h2><p>When you feel anxious or sad, write down: Situation, Thought, Emotion (0-100), Evidence For, Evidence Against, Balanced Thought, Emotion After.</p><h2>Technique 2: Worst Case / Best Case / Most Likely</h2><p>Ask yourself: What\'s the worst that could happen? Best possible outcome? Most likely scenario?</p><h2>Technique 3: Behavioral Activation</h2><p>Schedule activities even when you don\'t feel like it. Start ridiculously small — even 5 minutes counts.</p><h2>Technique 4: Progressive Muscle Relaxation</h2><p>Tense and release each muscle group for 5-10 seconds, starting from toes to head.</p><p><strong>Sources:</strong> APA Clinical Practice Guideline, 2019. Cognitive Behaviour Therapy journal.</p>',
          readTime: 6, tags: ['CBT', 'therapy', 'evidence-based', 'mindfulness', 'techniques'], featured: true
        },
        {
          title: 'Sleep Science for Students: What Research Actually Says',
          slug: 'sleep-science-students',
          category: 'sleep',
          excerpt: 'Your brain consolidates memories and processes emotions during sleep. Here\'s what neuroscience recommends.',
          content: '<p><em>Based on sleep research from the National Sleep Foundation and NIH.</em></p><h2>Why Sleep Is Non-Negotiable</h2><p>During sleep your brain: consolidates memories, processes emotions, clears toxins, repairs cells. A single night of poor sleep impairs cognitive function as much as being legally drunk.</p><h2>The College Sleep Crisis</h2><p>More than 60% of college students report poor sleep quality. Consequences: lower GPA, increased anxiety/depression, weakened immunity.</p><h2>Evidence-Based Sleep Hygiene</h2><ol><li><strong>Consistent Schedule:</strong> Same bed and wake time every day</li><li><strong>Screen Curfew:</strong> No screens 1 hour before bed</li><li><strong>Cool Temperature:</strong> 18-20°C is ideal</li><li><strong>Caffeine Cutoff:</strong> No caffeine after 2 PM</li><li><strong>Light Exposure:</strong> Get bright light within 30 minutes of waking</li></ol><p><strong>Sources:</strong> National Institute of Neurological Disorders. Sleep Medicine Reviews.</p>',
          readTime: 5, tags: ['sleep', 'science', 'students', 'evidence-based', 'health'], featured: false
        },
        {
          title: 'Self-Care Isn\'t a Buzzword: WHO and APA Guidelines on Daily Wellness',
          slug: 'self-care-who-apa-guidelines',
          category: 'self-care',
          excerpt: 'The WHO defines self-care as the ability to promote health and prevent disease. Here are evidence-based daily habits.',
          content: '<p><em>Based on WHO Self-Care Guidelines and APA recommendations.</em></p><h2>The Big 5 (Backed by Research)</h2><h3>1. Movement</h3><p>10-minute brisk walk boosts mood for up to 2 hours. 150 minutes of exercise per week reduces depression risk by 26%.</p><h3>2. Nutrition</h3><p>Increase: fruits, vegetables, whole grains, omega-3 foods. Decrease: processed foods, excess sugar.</p><h3>3. Hydration</h3><p>Even mild dehydration causes fatigue and impaired concentration. Aim for 2-3 liters daily.</p><h3>4. Social Connection</h3><p>Strong social connections increase survival odds by 50%. Loneliness is as harmful as smoking 15 cigarettes daily.</p><h3>5. Sleep</h3><p>Non-negotiable 7-9 hours.</p><h2>Building Habits That Stick</h2><p>It takes an average of 66 days for a new behavior to become automatic. Start ridiculously small. Stack new habits onto existing ones. Missing one day doesn\'t break the chain.</p><p><strong>Sources:</strong> WHO Self-Care Guidelines, 2022. APA Lifestyle to Support Mental Health.</p>',
          readTime: 7, tags: ['self-care', 'WHO', 'APA', 'habits', 'evidence-based', 'wellness'], featured: true
        }
      ]);
      console.log('Articles seeded');
    }

    const adminPhone = process.env.ADMIN_PHONE || '9999999999';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234';
    const adminExists = await User.findOne({ phone: adminPhone, role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin', phone: adminPhone, password: adminPassword, role: 'admin', isVerified: true
      });
      console.log('Admin seeded');
    } else if (adminExists.password.length > 60) {
      await User.deleteOne({ _id: adminExists._id });
      await User.create({
        name: 'Admin', phone: adminPhone, password: adminPassword, role: 'admin', isVerified: true
      });
      console.log('Admin re-seeded (was double-hashed)');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};
