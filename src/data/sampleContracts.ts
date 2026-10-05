import { AnalysisResult } from '../types/contract';

export interface SampleDocument {
  id: string;
  name: string;
  categoryBadge: string;
  platform: string;
  description: string;
  rawText: string;
  precomputedResult: AnalysisResult;
}

export const SAMPLE_DOCUMENTS: SampleDocument[] = [
  {
    id: 'quick-commerce-partner',
    name: 'Quick-Commerce Rider Agreement (10-Min Delivery)',
    categoryBadge: 'Delivery Rider',
    platform: 'Blinkit / Zepto / Swiggy Instamart Style',
    description: 'Contains hidden peak hour mandatory slots, order cancellation deductions, and rain surge disclaimers.',
    rawText: `DELIVERY PARTNER ONBOARDING & SERVICE AGREEMENT
1. STATUS OF PARTNER: The Delivery Partner agrees and acknowledges that they are an independent contractor and not an employee of the Platform. No minimum wage, gratuity, provident fund, or severance obligations shall apply.
2. DEDICATED SLOTS & ACCEPTANCE RATE: The Partner must maintain an order acceptance rate of not less than 88% across all assigned 4-hour delivery shifts. Failure to achieve the required acceptance threshold shall lead to immediate forfeiture of daily baseline incentives (₹350) and a mandatory cooling-off lockout period of 48 hours.
3. DELIVERY TIME GUARANTEE & PENALTIES: Where an order is marked as delayed beyond the standard 14-minute hub dispatch window due to Partner transit delay, a service penalty fee of ₹40 per incident shall be deducted directly from weekly payout settlement.
4. RAIN SURGE & HAZARDOUS WEATHER: Weather surge increments are completely discretionary and determined unilaterally by the automated algorithmic dispatch system. The platform undertakes zero financial or medical liability in the event of slips, vehicle damage, or road accidents incurred during active delivery runs.
5. ASSET CHARGES & DEPOSITS: An onboarding gear fee of ₹1,800 for two branded t-shirts and an insulated delivery bag shall be debited in three weekly installments of ₹600 from Partner net payouts. This fee is non-refundable upon termination.
6. UNILATERAL DEACTIVATION: The Platform reserves the absolute right to deactivate, suspend, or terminate the Delivery Partner's account without prior written notice or right to physical hearing in cases of customer negative ratings below 4.5 stars or customer fraud disputes.`,
    precomputedResult: {
      id: 'quick-commerce-partner-analysis',
      documentTitle: 'Quick-Commerce Rider Service Agreement',
      documentType: 'contract',
      platformName: 'Quick Commerce Hub (Zepto/Blinkit Style)',
      safetyScore: 38,
      confidence: 'high',
      summary: 'Is agreement me rider ke liye kaafi khatarnak shartein hain: bina notice ID band hona, 14-minute se late hone par ₹40 ka penalty deduction, aur barish me accident hone par company ki zero liability.',
      workerAdvocateAdvice: [
        'Hub manager se written me maango ki delivery late hone par agar store packing delay thi, toh rider par penalty kyu lagegi.',
        'Rain surge aur accident insurance coverage policy ka document maango pehle.',
        'Har order dispatch aur delivery confirmation ka screenshot apne phone me save rakhein.'
      ],
      redFlagsCount: 3,
      cautionCount: 2,
      safeCount: 1,
      clauses: [
        {
          id: 'qc-c1',
          title: 'Unilateral ID Deactivation Without Hearing',
          category: 'deactivation',
          riskLevel: 'RISK',
          originalText: 'The Platform reserves the absolute right to deactivate, suspend, or terminate the Delivery Partner\'s account without prior written notice or right to physical hearing in cases of customer negative ratings below 4.5 stars.',
          plainExplanation: 'Agar customer ne galti se ya badle me 1-star rating di aur rating 4.5 se niche aayi, toh company bina kisi notice ya safai ke aapki ID block kar sakti hai. Aapko apni baat rakhne ka mauka nahi milega.',
          analogy: 'Yeh aisa hai jaise bina kisi sunwai ke dukaan ka taala laga diya jaye aur chabi bhi na di jaye.',
          actionableTip: 'Agar customer badtameezi kare ya wrong rating ki dhamki de, turant in-app support chat pe ticket raise karein aur proof upload karein.',
          financialImpact: 'Poori aamdani achanak band hone ka khatra (Complete loss of livelihood).'
        },
        {
          id: 'qc-c2',
          title: 'Accident & Bad Weather Zero Liability Disclaimer',
          category: 'insurance',
          riskLevel: 'RISK',
          originalText: 'The platform undertakes zero financial or medical liability in the event of slips, vehicle damage, or road accidents incurred during active delivery runs.',
          plainExplanation: 'Barish, tufan ya traffic me delivery karte waqt agar gaadi fisal jaye ya chot lag jaye, toh company hospital ka bill ya bike repair ka ek rupya bhi nahi degi.',
          analogy: 'Company order deliver karwake munafa kamayegi, par aapke fracture ka kharcha aapke khud ke jeb se lagega.',
          actionableTip: 'Hub manager se poochein: "Social Security Code 2020 ke tahat hamara Group Personal Accident cover kahaan hai?"',
          financialImpact: 'Hospitalization bills ₹20,000 - ₹1,00,000 ka pura bojh rider par.'
        },
        {
          id: 'qc-c3',
          title: 'Order Delay Penalty Deduction (₹40/Incident)',
          category: 'penalties',
          riskLevel: 'RISK',
          originalText: 'Where an order is marked as delayed beyond the standard 14-minute hub dispatch window due to Partner transit delay, a service penalty fee of ₹40 per incident shall be deducted directly from weekly payout settlement.',
          plainExplanation: 'Agar traffic, red light ya lift kharab hone ki wajah se 14 minute se upar hua, toh per order ₹40 kamai se seedhe cut jayenge. Pure din me 3 orders late hue toh ₹120 ka nuksan!',
          analogy: 'Jaise auto me baithe customer ko der hone par driver se hi ulta kiraya kaat liya jaye.',
          actionableTip: 'Jab bhi dispatch store par order lene me 3 minute se zyada lage, app me "Merchant Delay" button dabayein taaki timer ruk jaye.',
          financialImpact: 'Hafte ka ₹500 se ₹1,500 tak ka nuksan payout se cut ho sakta hai.'
        },
        {
          id: 'qc-c4',
          title: '88% Minimum Order Acceptance Trap',
          category: 'working_hours',
          riskLevel: 'CAUTION',
          originalText: 'The Partner must maintain an order acceptance rate of not less than 88% across all assigned 4-hour delivery shifts. Failure to achieve the required acceptance threshold shall lead to immediate forfeiture of daily baseline incentives (₹350).',
          plainExplanation: 'Aapko lagbhag har order accept karna padega chahe rasta kitna bhi kharab ho ya distance zyada ho. 10 me se 2 order reject kiye toh pure din ka ₹350 incentive gayab aur 2 din ka lockout!',
          analogy: 'Aapko "independent" bolte hain, par order chhodne ka haq nahi dete.',
          actionableTip: 'Long distance order aane par reject karne se pehle dhyan de ki din ka incentive na chhoot jaye.',
          financialImpact: '₹350 daily incentive loss (~₹9,100 per month).'
        },
        {
          id: 'qc-c5',
          title: 'Non-Refundable Bag & T-shirt Gear Deduction',
          category: 'equipment',
          riskLevel: 'CAUTION',
          originalText: 'An onboarding gear fee of ₹1,800 for two branded t-shirts and an insulated delivery bag shall be debited in three weekly installments of ₹600 from Partner net payouts. This fee is non-refundable upon termination.',
          plainExplanation: 'Company ki branding wali t-shirt aur bag ka ₹1,800 aapki kamai se teen hafte me katega. Agar aap kaam chhod bhi dete hain, toh yeh paisa wapas nahi milega.',
          analogy: 'Company ke ad ke liye board aap lagao aur uske paise bhi aapki jeb se katein.',
          actionableTip: 'Ensure karein ki pehle hafte ke payout me ₹600 se zyada to nahi kaata gaya.',
          financialImpact: '₹1,800 one-time upfront deduction.'
        },
        {
          id: 'qc-c6',
          title: 'Independent Contractor Legal Status',
          category: 'legal',
          riskLevel: 'SAFE',
          originalText: 'The Delivery Partner agrees and acknowledges that they are an independent contractor and not an employee of the Platform.',
          plainExplanation: 'Yeh standard legal clause hai jo sabhi gig platform lagate hain. Iska matlab aap apni gaadi aur phone khud use karte hain, company ke regular payroll employee nahi hain.',
          analogy: 'Jaise plumber ya electrician apna khud ka kaam karte hain.',
          actionableTip: 'Aap doosre delivery apps me bhi id bana kar kaam kar sakte hain kyunki aap exclusive employee nahi hain.',
          financialImpact: 'Flexibility to switch apps, but no PF/ESI benefits.'
        }
      ],
      spokenScripts: {
        hi: {
          language: 'Hindi / Hinglish',
          languageCode: 'hi',
          title: 'राइडर भाईयों के लिए 60-सेकंड की ऑडियो रिपोर्ट',
          scriptText: 'नमस्ते डिलीवरी पार्टनर भाई! ध्यान से सुनो: इस एग्रीमेंट में 3 बातें बहुत जरूरी और खतरनाक हैं। पहली—अगर 14 मिनट से डिलीवरी लेट हुई तो प्रति ऑर्डर ₹40 सीधे आपकी कमाई से कटेंगे, इसलिए हमेशा स्टोर डिले मार्क करें। दूसरी—बारिश या आंधी में एक्सीडेंट होने पर कंपनी ने साफ लिख दिया है कि अस्पताल के खर्चे की कोई जिम्मेदारी उनकी नहीं है। और तीसरी—कस्टमर ने गलत रेटिंग दी और स्कोर 4.5 से गिरा, तो बिना कोई नोटिस दिए आपकी आईडी बंद की जा सकती है। इसके अलावा टी-शर्ट और बैग के ₹1,800 भी कटेंगे जो वापस नहीं होंगे। काम शुरू करने से पहले हब मैनेजर से एक्सीडेंटल इंश्योरेंस की पॉलिसी कॉपी जरूर मांगें!',
          bulletPoints: [
            'लेट डिलीवरी पर ₹40 प्रति ऑर्डर डिडक्शन',
            'बारिश/हादसे में कंपनी की जीरो मेडिकल लायबिलिटी',
            '4.5 से कम रेटिंग पर बिना सुनवाई आईडी ब्लॉक',
            'टी-शर्ट व बैग के ₹1,800 नॉन-रिफंडेबल कटौती'
          ]
        },
        en: {
          language: 'Simple English',
          languageCode: 'en',
          title: '60-Second Plain Spoken Audio Brief',
          scriptText: 'Hello delivery partner! Here are the 3 critical red flags in this agreement. First, if a delivery takes longer than 14 minutes due to transit delays, ₹40 per incident is directly deducted from your payout. Always tap Merchant Delay if the store makes you wait. Second, during rain or accidents on the road, the company has zero financial or medical liability—you pay your own medical bills. Third, if customer ratings dip below 4.5, your account can be terminated instantly without any warning or hearing. Also, ₹1,800 will be deducted for bags and t-shirts with zero refund. Please demand the accidental group insurance certificate from your hub lead before taking orders!',
          bulletPoints: [
            '₹40 deduction per delayed delivery incident',
            'Zero accident & weather medical liability from platform',
            'Instant account suspension if rating drops below 4.5',
            '₹1,800 non-refundable kit fee deducted in installments'
          ]
        },
        ta: {
          language: 'Tamil',
          languageCode: 'ta',
          title: 'டெலிவரி தோழர்களுக்கான 60 வினாடி ஆடியோ விளக்கம்',
          scriptText: 'வணக்கம் தோழரே! இந்த ஒப்பந்தத்தில் 3 மிக முக்கியமான அபாயங்கள் உள்ளன. முதலாவதாக, டெலிவரி 14 நிமிடங்களுக்கு மேல் தாமதமானால், ஒரு ஆர்டருக்கு ₹40 அபராதமாக உங்கள் சம்பளத்தில் பிடித்தம் செய்யப்படும். இரண்டாவதாக, மழையிலோ அல்லது விபத்திலோ காயம் ஏற்பட்டால் நிறுவனம் எந்த மருத்துவச் செலவையும் ஏற்காது. மூன்றாவதாக, கஸ்டமர் ரேட்டிங் 4.5-க்குக் கீழே குறைந்தால் எந்த முன்னறிவிப்பும் இன்றி ஐடி முடக்கப்படலாம். மேலும் யூனிபார்ம் மற்றும் பைக்கு ₹1,800 உங்கள் சம்பளத்திலிருந்து கழிக்கப்படும். கையொப்பமிடும் முன் உங்கள் மேனேஜரிடம் விபத்துக் காப்பீட்டு சான்றிதழைக் கேளுங்கள்!',
          bulletPoints: [
            'தாமத டெலிவரிக்கு ஆர்டருக்கு ₹40 அபராதம்',
            'விபத்து ஏற்பட்டால் நிறுவனத்திடம் மருத்துவ உதவி இல்லை',
            '4.5-க்கு கீழ் ரேட்டிங் குறைந்தால் ஐடி ரத்து',
            'சீருடை மற்றும் பைக்கு ₹1,800 பிடித்தம்'
          ]
        },
        te: {
          language: 'Telugu',
          languageCode: 'te',
          title: 'డెలివరీ సోదరుల కోసం 60 సెకన్ల ఆడియో సమాచారం',
          scriptText: 'నమస్కారం డెలివరీ సోదరా! ఈ ఒప్పందంలో 3 ప్రమాదకరమైన నిబంధనలు ఉన్నాయి. మొదటిది—డెలివరీ 14 నిమిషాల కంటే ఆలస్యమైతే ప్రతి ఆర్డర్‌కు ₹40 మీ సంపాదన నుండి కట్ చేస్తారు. రెండవది—వర్షంలో లేదా డ్యూటీలో ప్రమాదం జరిగితే ఆసుపత్రి ఖర్చులను కంపెనీ భరించదు, పూర్తి బాధ్యత మీదే. మూడవది—కస్టమర్ రేటింగ్ 4.5 కంటే తగ్గితే ముందస్తు నోటీసు లేకుండానే మీ ఐడీని బ్లాక్ చేయవచ్చు. అదనంగా బ్యాగ్ మరియు టీ-షర్ట్ కోసం ₹1,800 కట్ చేస్తారు. పని మొదలుపెట్టే ముందే యాక్సిడెంట్ ఇన్సూరెన్స్ కాపీని మీ హబ్ మేనేజర్‌ను అడగండి!',
          bulletPoints: [
            'ఆలస్యమైన ఆర్డర్‌కు ₹40 కోత',
            'ప్రమాదం జరిగితే కంపెనీ నుండి ఎటువంటి వైద్య సహాయం ఉండదు',
            '4.5 కంటే తక్కువ రేటింగ్‌పై ఐడీ బ్లాక్',
            'బ్యాగ్ మరియు టీ-షర్ట్ కోసం ₹1,800 కటింగ్'
          ]
        },
        mr: {
          language: 'Marathi',
          languageCode: 'mr',
          title: 'डिलिव्हरी रायडर्ससाठी ६० सेकंदांचा ऑडिओ अहवाल',
          scriptText: 'नमस्कार रायडर भावांनो! या करारामध्ये ३ अतिशय महत्त्वाच्या आणि धोक्याच्या अटी आहेत. पहिली—जर डिलिव्हरी १४ मिनिटांपेक्षा उशीर झाली तर दर ऑर्डर ₹४० थेट तुमच्या पेआउटमधून कापले जातील. दुसरी—पावसात किंवा रस्त्यावर अपघात झाल्यास कंपनी कोणताही वैद्यकीय खर्च देणार नाही, पूर्ण खर्च तुमचा असेल. तिसरी—कस्टमर रेटिंग ४.५ च्या खाली गेली तर कोणतीही नोटीस न देता तुमची आयडी बंद केली जाऊ शकते. टी-शर्ट आणि बॅगचे ₹१,८०० कापले जातील जे परत मिळणार नाहीत. काम सुरू करण्यापूर्वी हब मॅनेजरकडून अपघात विम्याची प्रत नक्की मागा!',
          bulletPoints: [
            'डिलिव्हरी उशीर झाल्यास ₹४० प्रति ऑर्डर दंड',
            'अपघातात कंपनीची कोणतीही वैद्यकीय जबाबदारी नाही',
            'रेटिंग ४.५ पेक्षा कमी झाल्यास आयडी त्वरित बंद',
            'बॅग व टी-शर्टसाठी ₹१,८०० नॉन-रिफंडेबल कपात'
          ]
        },
        bn: {
          language: 'Bengali',
          languageCode: 'bn',
          title: 'ডেলিভারি রাইডারদের জন্য ৬০ সেকেন্ডের অডিও ব্রিফ',
          scriptText: 'নমস্কার ডেলিভারি ভাই! এই চুক্তিতে ৩টি মারাত্মক শর্ত রয়েছে। প্রথমত—ডেলিভারি ১৪ মিনিটের বেশি দেরি হলে প্রতি অর্ডারে ₹৪০ আপনার উপার্জন থেকে কেটে নেওয়া হবে। দ্বিতীয়ত—বৃষ্টি বা রাস্তায় কোনো দুর্ঘটনা ঘটলে কোম্পানি চিকিৎসার এক পয়সাও দেবে না। তৃতীয়ত—কাস্টমার রেটিং ৪.৫-এর নিচে নামলে কোনো নোটিশ ছাড়াই আপনার আইডি চিরতরে বন্ধ করে দেওয়া হতে পারে। এছাড়াও টি-শার্ট ও ব্যাগের জন্য ₹১,৮০০ কাটা হবে যা ফেরতযোগ্য নয়। কাজ শুরুর আগে আপনার হাব ইন-চার্জের কাছে দুর্ঘটনা বীমার নথি অবশ্যই দাবি করুন!',
          bulletPoints: [
            'দেরি ডেলিভারিতে অর্ডার প্রতি ₹৪০ জরিমানা কাটা',
            'দুর্ঘটনায় কোম্পানির শূন্য চিকিৎসা সাহায্য',
            '৪.৫-এর কম রেটিং হলে কোনো শুনানি ছাড়াই আইডি ব্লক',
            'ইউনিফর্ম ও ব্যাগের ₹১,৮০০ অজামানতিযোগ্য কর্তন'
          ]
        },
        kn: {
          language: 'Kannada',
          languageCode: 'kn',
          title: 'ಡೆಲಿವರಿ ಪಾಲುದಾರರಿಗೆ 60 ಸೆಕೆಂಡಿನ ಆಡಿಯೋ ವಿವರಣೆ',
          scriptText: 'ನಮಸ್ಕಾರ ಡೆಲಿವರಿ ರೈಡರ್ ಮಿತ್ರರೇ! ಈ ಒಪ್ಪಂದದಲ್ಲಿ 3 ಪ್ರಮುಖ ಅಪಾಯಕಾರಿ ನಿಯಮಗಳಿವೆ. ಮೊದಲನೆಯದು—ಡೆಲಿವರಿ 14 ನಿಮಿಷಕ್ಕಿಂತ ತಡವಾದರೆ ಪ್ರತಿ ಆರ್ಡರ್‌ಗೆ ₹40 ನಿಮ್ಮ ಗಳಿಕೆಯಿಂದ ಕಡಿತಗೊಳಿಸಲಾಗುತ್ತದೆ. ಎರಡನೆಯದು—ಮಳೆಯಲ್ಲಿ ಅಥವಾ ರಸ್ತೆಯಲ್ಲಿ ಅಪಘಾತವಾದರೆ ಕಂಪನಿಯು ಯಾವುದೇ ಆಸ್ಪತ್ರೆ ವೆಚ್ಚವನ್ನು ಭರಿಸುವುದಿಲ್ಲ. ಮೂರನೆಯದು—ಗ್ರಾಹಕರ ರೇಟಿಂಗ್ 4.5 ಕ್ಕಿಂತ ಕಡಿಮೆಯಾದರೆ ಯಾವುದೇ ನೋಟಿಸ್ ಇಲ್ಲದೆ ನಿಮ್ಮ ಐಡಿ ಬ್ಲಾಕ್ ಮಾಡಬಹುದು. ಕೆಲಸ ಆರಂಭಿಸುವ ಮುನ್ನ ಹಬ್ ಮ್ಯಾನೇಜರ್‌ ಬಳಿ ಅಪಘಾತ ವಿಮಾ ಪಾಲಿಸಿಯನ್ನು ಕೇಳಿ!',
          bulletPoints: [
            'ತಡವಾದ ಡೆಲಿವರಿಗೆ ₹40 ದಂಡ ಕಡಿತ',
            'ಅಪಘಾತದಲ್ಲಿ ಕಂಪನಿಯಿಂದ ಯಾವುದೇ ವೈದ್ಯಕೀಯ ನೆರವಿಲ್ಲ',
            '4.5 ಗಿಂತ ಕಡಿಮೆ ರೇಟಿಂಗ್ ಬಂದರೆ ಐಡಿ ರದ್ದು',
            'ಬ್ಯಾಗ್ ಮತ್ತು ಟೀ-ಶರ್ಟ್‌ಗೆ ₹1,800 ಕಡಿತ'
          ]
        }
      },
      workerQuestionsToAsk: [
        '"अगर मर्चेंट स्टोर ने ऑर्डर पैक करने में 10 मिनट लगाए, तो क्या डिलीवरी डिले का ₹40 पेनल्टी मुझपर लगेगा या मर्चेंट पर?"',
        '"Social Security Code 2020 के तहत जो सरकार ने गिग वर्कर्स के लिए एक्सीडेंटल इंश्योरेंस बनाया है, उसकी क्लेम प्रोसेस क्या है?"',
        '"अगर किसी कस्टमर ने डिलीवरी के बाद गलत 1-स्टार रेटिंग दी, तो क्या मैं ऑडियो या लोकेशन प्रूफ देकर अपील कर सकता हूँ?"',
        '"₹1,800 बैग और टी-शर्ट डिपॉजिट क्या 6 महीने लगातार काम करने के बाद रिफंड होगा?"'
      ],
      analyzedAt: new Date().toISOString()
    }
  },
  {
    id: 'cab-driver-agreement',
    name: 'Ride-Hailing Driver Agreement (Cab / Auto)',
    categoryBadge: 'Cab & Auto Driver',
    platform: 'Uber / Ola / Rapido Style',
    description: 'Covers variable platform fee commission (up to 32%), vehicle inspection charges, and cancellation penalty clauses.',
    rawText: `DRIVER PARTNER MASTER TERMS OF ENGAGEMENT
1. COMMISSION & PLATFORM FEE: The Driver Partner authorizes the Platform to deduct a variable platform fee of up to 30% plus applicable GST on gross ride fares, along with a rider convenience fee. Surge pricing multiplier share shall be determined exclusively by the proprietary routing algorithm.
2. CANCELLATION RATE & PENALTIES: A Driver cancellation rate exceeding 6% of assigned bookings in any rolling 7-day period shall result in a tier demotion, forfeiture of fuel subsidy credits, and a fine of ₹250 deducted from the wallet.
3. CUSTOMER COMPLAINTS & CASH DISPUTES: In the event of a customer dispute alleging route deviation, air conditioning non-usage, or cash overcharging, the disputed fare amount shall be held in escrow and debited from the Partner wallet prior to investigation.
4. INDEPENDENT TAX COMPLIANCE: The Driver Partner is solely responsible for 1% TDS filing under Section 194O, state commercial road tax, and personal fitness certificates. The Company assumes no agency relationship.
5. ARBITRATION & JURISDICTION: All disputes arising under this agreement must be submitted to private binding arbitration held exclusively in New Delhi, in the English language only. The Driver Partner waives the right to participate in any collective bargaining or class action lawsuits.`,
    precomputedResult: {
      id: 'cab-driver-analysis',
      documentTitle: 'Ride-Hailing Driver Partner Master Terms',
      documentType: 'contract',
      platformName: 'Ride-Hailing Network (Uber/Ola Style)',
      safetyScore: 42,
      confidence: 'high',
      summary: 'Driver bhaiya dhyan dein: Company ride fare par 30% tak commission kaat sakti hai, 6% se zyada ride cancel karne par ₹250 ka jurmana hai, aur customer ke ek complaint par bina jaanch ke aapka paisa wallet se hold ho jata hai.',
      workerAdvocateAdvice: [
        'Har ride ka fare breakdown daily app me check karein taaki pata chale commission 30% se zyada toh nahi kata.',
        'AC ya route complaint se bachne ke liye ride shuru hote hi passenger se route confirm karein.',
        'Arbitration clause New Delhi me hai, iska matlab local police station ya labour court me shikayat company aasani se reject kar sakti hai.'
      ],
      redFlagsCount: 2,
      cautionCount: 3,
      safeCount: 1,
      clauses: [
        {
          id: 'cd-c1',
          title: 'Mandatory Arbitration in New Delhi & Class Action Ban',
          category: 'legal',
          riskLevel: 'RISK',
          originalText: 'All disputes arising under this agreement must be submitted to private binding arbitration held exclusively in New Delhi, in the English language only. The Driver Partner waives the right to participate in any collective bargaining.',
          plainExplanation: 'Agar company ne aapke paise roke ya galat ID block ki, toh aap apne shahar ki local court ya union ke sath nahi ja sakte. Aapko akele New Delhi me English me private vakeel ke aage case ladna hoga, jo kisi bhi aam driver ke liye asambhav hai.',
          analogy: 'Yeh aisa hai jaise gaon ke jhagde ka faisla karne ke liye America ke judge ke pass jaane ko kaha jaye.',
          actionableTip: 'Apni regional gig worker union ya driver sangathan ke group me judkar rahein.',
          financialImpact: 'Legal dispute ladne ka kharcha ₹50,000+ jo aam driver afford nahi kar sakta.'
        },
        {
          id: 'cd-c2',
          title: 'Unilateral Wallet Debit on Customer Dispute',
          category: 'penalties',
          riskLevel: 'RISK',
          originalText: 'In the event of a customer dispute alleging route deviation, air conditioning non-usage, or cash overcharging, the disputed fare amount shall be held in escrow and debited from the Partner wallet prior to investigation.',
          plainExplanation: 'Agar kisi passenger ne jhoothi complaint kar di ki AC nahi chalaya ya route lamba liya, toh bina aapse sach jaane company passenger ka paisa aapke wallet se turant kaat legi.',
          analogy: 'Bina chor saabit huye jeb se paise nikaal lena.',
          actionableTip: 'Kharab traffic ya road blockage hone par passenger ko bata kar app ke navigation map ka screenshot lein.',
          financialImpact: 'Ride fare ₹200-₹800 ka seedha nuksan bina investigation ke.'
        },
        {
          id: 'cd-c3',
          title: 'Variable Commission Cut Up to 30% + GST',
          category: 'payouts',
          riskLevel: 'CAUTION',
          originalText: 'The Driver Partner authorizes the Platform to deduct a variable platform fee of up to 30% plus applicable GST on gross ride fares, along with a rider convenience fee.',
          plainExplanation: 'Passenger agar ₹1,000 deta hai, toh ₹300+ tax seedhe company le legi, petrol aur gaadi ki EMI ka kharcha pura aapka hoga. Sirf ₹600-₹650 aapki jeb me aayega.',
          analogy: 'Mehnat aapki, gaadi aapki, par har tisra kilometer company ke naam ka.',
          actionableTip: 'Daily gross fare aur net payout ka hisab diary ya app me maintain karein.',
          financialImpact: 'Gross earnings ka 30% se 35% tak commission deduction.'
        },
        {
          id: 'cd-c4',
          title: 'Cancellation Penalty & Fuel Subsidy Loss (>6%)',
          category: 'working_hours',
          riskLevel: 'CAUTION',
          originalText: 'A Driver cancellation rate exceeding 6% of assigned bookings in any rolling 7-day period shall result in a tier demotion, forfeiture of fuel subsidy credits, and a fine of ₹250.',
          plainExplanation: 'Agar 100 me se 7 ride aapne cancel ki (chahe passenger pick up point par na aaya ho ya traffic jam ho), toh ₹250 wallet se katenge aur fuel discount band!',
          analogy: 'Majboori me mana karne par bhi jurmana.',
          actionableTip: 'Passenger ke cancel na karne par "Client No Show" ka 5-minute timer pura hone ke baad hi cancel karein.',
          financialImpact: '₹250 penalty per week plus loss of fuel discount credits.'
        },
        {
          id: 'cd-c5',
          title: 'Independent TDS Section 194O Filing Obligation',
          category: 'payouts',
          riskLevel: 'SAFE',
          originalText: 'The Driver Partner is solely responsible for 1% TDS filing under Section 194O, state commercial road tax, and personal fitness certificates.',
          plainExplanation: 'Government rule ke mutabik company 1% TDS kaat kar Income Tax department ko deti hai. Yeh paisa aap ITR file karke saal ke aakhir me refund le sakte hain.',
          analogy: 'Jaise bank me savings par TDS katne par wapas milta hai.',
          actionableTip: 'Apna PAN card driver app me link rakhein aur saal ke ant me Form 26AS download karke TDS wapas claim karein.',
          financialImpact: '1% payout deduction, fully refundable via annual income tax return.'
        }
      ],
      spokenScripts: {
        hi: {
          language: 'Hindi / Hinglish',
          languageCode: 'hi',
          title: 'ड्राइवर साथियों के लिए 60-सेकंड की ऑडियो रिपोर्ट',
          scriptText: 'नमस्ते ड्राइवर भाई! ध्यान से सुनो: इस कैब एग्रीमेंट में कंपनी 30% तक भारी कमीशन काट रही है। अगर आपने हफ्ते में 6% से ज्यादा राइड कैंसिल की, तो ₹250 का जुर्माना और फ्यूल सब्सिडी का नुकसान होगा। सबसे बड़ी बात—अगर सवारी ने एसी या रूट की झूठी शिकायत की, तो बिना आपकी बात सुने वॉलेट से पूरा किराया काट लिया जाता है। इसके अलावा विवाद होने पर केवल दिल्ली में इंग्लिश में केस लड़ना पड़ेगा। इसलिए किसी भी विवाद में कस्टमर से बहस न करें, मैप का स्क्रीनशॉट लें और कैंसिलेशन हमेशा 5 मिनट का टाइमर पूरा होने के बाद ही करें!',
          bulletPoints: [
            '30% तक भारी प्लेटफॉर्म कमीशन व टैक्स कटौती',
            '6% से ज्यादा कैंसिलेशन पर ₹250 पेनल्टी व फ्यूल डिस्काउंट बंद',
            'सवारी की शिकायत पर बिना जांच वॉलेट से किराया काटना',
            'विवाद होने पर केवल दिल्ली में इंग्लिश में मध्यस्थता (Arbitration)'
          ]
        },
        en: {
          language: 'Simple English',
          languageCode: 'en',
          title: '60-Second Audio Brief for Drivers',
          scriptText: 'Attention Driver Partner! Three key clauses to watch out for: First, the platform can take up to 30% plus GST on every fare, leaving you with heavy vehicle maintenance and fuel burdens. Second, keeping a cancellation rate above 6% incurs an automatic ₹250 penalty and cancels your fuel benefits. Third, if a customer disputes the fare over AC or routing, the company immediately debits your wallet without prior investigation. Always wait for the full 5-minute passenger arrival timer before canceling, and save ride screenshots for fare protection!',
          bulletPoints: [
            'Up to 30% commission + GST deducted from every trip',
            '₹250 penalty if weekly cancellation rate exceeds 6%',
            'Immediate wallet fare debit on customer complaint',
            'Arbitration restricted to New Delhi in English only'
          ]
        },
        ta: {
          language: 'Tamil',
          languageCode: 'ta',
          title: 'டிரைவர் தோழர்களுக்கான 60 வினாடி ஆடியோ விளக்கம்',
          scriptText: 'வணக்கம் டிரைவர் தோழரே! இந்த ஒப்பந்தத்தில் முக்கியமாக 3 விஷயங்களைக் கவனிக்க வேண்டும்: ஒன்று, கட்டணத்தில் 30% வரை நிறுவனம் கமிஷனாகப் பிடிக்கிறது. இரண்டு, 6%-க்கு மேல் சவாரிகளை ரத்து செய்தால் ₹250 அபராதம் மற்றும் எரிபொருள் சலுகை ரத்து செய்யப்படும். மூன்று, பயணி ஏசி அல்லது வழித்தடம் குறித்து புகார் அளித்தால், உங்கள் பக்க நியாயத்தைக் கேட்காமலேயே உங்கள் வாலட்டிலிருந்து பணம் பிடித்தம் செய்யப்படும். எனவே சவாரியை ரத்து செய்வதற்கு முன் 5 நிமிட டைமரை முழுமையாக முடிய விடுங்கள்!',
          bulletPoints: [
            'சவாரி கட்டணத்தில் 30% வரை அதிக கமிஷன் பிடித்தம்',
            'ரத்து விகிதம் 6% தாண்டினால் ₹250 அபராதம்',
            'பயணி புகாரின் பேரில் உடனடியாக வாலட் பணம் பிடித்தம்',
            'சட்ட தகராறு தில்லியில் மட்டுமே தீர்க்கப்படும்'
          ]
        },
        te: {
          language: 'Telugu',
          languageCode: 'te',
          title: 'డ్రైవర్ సోదరుల కోసం 60 సెకన్ల ఆడియో సమాచారం',
          scriptText: 'నమస్కారం డ్రైవర్ సోదరా! ఈ ఒప్పందంలో 30% వరకు భారీ కమిషన్ కోత ఉంది. వారంలో 6% కంటే ఎక్కువ రైడ్‌లను రద్దు చేస్తే ₹250 జరిమానా పడుతుంది మరియు ఇంధన రాయితీ రద్దవుతుంది. ప్రయాణికుడు ఏసీ లేదా రూట్ గురించి ఫిర్యాదు చేస్తే మీతో మాట్లాడకుండానే మీ వాలెట్ నుండి ఛార్జీని కట్ చేస్తారు. వివాదం వస్తే ఢిల్లీలో ఇంగ్లీషులోనే తేల్చుకోవాలని రాశారు. కాబట్టి ప్రయాణికుడు రానప్పుడు 5 నిమిషాల టైమర్ పూర్తయిన తర్వాతే రైడ్ రద్దు చేయండి!',
          bulletPoints: [
            'రైడ్ ఛార్జీలో 30% వరకు కమిషన్ కోత',
            '6% రద్దు దాటితే ₹250 జరిమానా మరియు సబ్సిడీ నష్టం',
            'ఫిర్యాదు రాగానే విచారణ లేకుండా వాలెట్ కటింగ్',
            'సమస్యల పరిష్కారం కేవలం ఢిల్లీ కోర్టుల పరిధిలోనే'
          ]
        },
        mr: {
          language: 'Marathi',
          languageCode: 'mr',
          title: 'कॅब ड्रायव्हर्ससाठी ६० सेकंदांचा ऑडिओ अहवाल',
          scriptText: 'नमस्कार ड्रायव्हर मित्रांनो! या करारात ३०% पर्यंत मोठी कमिशन कपात आहे. आठवड्यात ६% पेक्षा जास्त राईड्स रद्द केल्यास ₹२५० दंड आणि इंधन सवलत बंद होईल. ग्राहकाने तक्रार केली तर विचारपूस न करता तुमच्या वॉलेटमधून भाडे कापले जाईल. प्रवाशाने गाडी रद्द न केल्यास नेहमी ५ मिनिटांचा टायमर पूर्ण झाल्यानंतरच राईड रद्द करा!',
          bulletPoints: [
            '३०% पर्यंत मोठी प्लॅटफॉर्म कमिशन कपात',
            '६% पेक्षा जास्त कॅन्सलेशनवर ₹२५० दंड',
            'तक्रारीवर थेट वॉलेटमधून भाडे जप्त',
            'कायदेशीर वाद केवळ दिल्लीतच सोडवला जाईल'
          ]
        },
        bn: {
          language: 'Bengali',
          languageCode: 'bn',
          title: 'ক্যাব চালকদের জন্য ৬০ সেকেন্ডের অডিও ব্রিফ',
          scriptText: 'নমস্কার চালক ভাই! এই চুক্তিতে কোম্পানি ৩০% পর্যন্ত মোটা কমিশন কেটে নিচ্ছে। সপ্তাহে ৬%-এর বেশি রাইড বাতিল করলে ₹২৫০ জরিমানা হবে। কোনো যাত্রী অভিযোগ জানালে কোম্পানি আপনার বক্তব্য না শুনেই ওয়ালেট থেকে টাকা কেটে নেবে। তাই যাত্রী না এলে সবসময় ৫ মিনিটের টাইমার শেষ হওয়ার পরেই বাতিল করুন!',
          bulletPoints: [
            'ভাড়ার উপর ৩০% পর্যন্ত কমিশন কর্তন',
            'সপ্তাহে ৬% বাতিলের বেশি হলে ₹২৫০ জরিমানা',
            'যাত্রীর অভিযোগে সঙ্গে সঙ্গে ওয়ালেট থেকে টাকা কাটা',
            'আইনি বিবাদ শুধুমাত্র দিল্লিতে ইংরেজি ভাষায় মীমাংসা'
          ]
        },
        kn: {
          language: 'Kannada',
          languageCode: 'kn',
          title: 'ಕ್ಯಾಬ್ ಚಾಲಕರಿಗೆ 60 ಸೆಕೆಂಡಿನ ಆಡಿಯೋ ವಿವರಣೆ',
          scriptText: 'ನಮಸ್ಕಾರ ಚಾಲಕ ಮಿತ್ರರೇ! ಈ ಒಪ್ಪಂದದಲ್ಲಿ ಕಂಪನಿಯು ಪ್ರತಿ ಸವಾರಿಗೆ 30% ವರೆಗೆ ಕಮಿಷನ್ ಕಡಿತಗೊಳಿಸುತ್ತದೆ. ವಾರದಲ್ಲಿ 6% ಕ್ಕಿಂತ ಹೆಚ್ಚು ರೈಡ್ ರದ್ದುಗೊಳಿಸಿದರೆ ₹250 ದಂಡ ವಿಧಿಸಲಾಗುತ್ತದೆ. ಗ್ರಾಹಕರು ದೂರು ನೀಡಿದರೆ ನಿಮ್ಮ ವಿವರಣೆ ಕೇಳದೆ ವಾಲೆಟ್‌ನಿಂದ ಹಣ ಕಡಿತಗೊಳಿಸುತ್ತಾರೆ!',
          bulletPoints: [
            '30% ವರೆಗೆ ಕಮಿಷನ್ ಕಡಿತ',
            '6% ಕ್ಯಾನ್ಸಲೇಷನ್ ಮೀರಿದರೆ ₹250 ದಂಡ',
            'ಗ್ರಾಹಕರ ದೂರಿನ ಮೇಲೆ ತಕ್ಷಣ ವಾಲೆಟ್ ಹಣ ಕಡಿತ'
          ]
        }
      },
      workerQuestionsToAsk: [
        '"अगर पैसेंजर 5 मिनट के बाद नहीं आया और मैंने कैंसिल किया, तो क्या वो 6% कैंसिलेशन रेट में गिना जाएगा?"',
        '"30% कमीशन के अलावा जो कस्टमर कन्वीनियंस फीस कटती है, उसका पूरा ब्रेकडाउन बिल में क्यों नहीं दिखता?"',
        '"अगर कस्टमर झूठी शिकायत करे कि एसी नहीं चला, तो क्या मैं डैशकैम या एसी ऑन का प्रूफ देकर कटा हुआ पैसा वापस ले सकता हूँ?"'
      ],
      analyzedAt: new Date().toISOString()
    }
  },
  {
    id: 'payout-slip-deduction',
    name: 'Weekly Earnings & Penalty Deductions Slip',
    categoryBadge: 'Payout Slip',
    platform: 'Shadowfax / Porter / Zomato Style',
    description: 'Deconstructs net payout vs gross earnings with unexplained customer dispute charges and uniform deposits.',
    rawText: `WEEKLY SETTLEMENT STATEMENT: 22-SEP TO 28-SEP
Gross Completed Task Orders (54 Runs): ₹5,840.00
Target Milestone Peak Incentive: ₹600.00
GROSS EARNINGS: ₹6,440.00

LESS DEDUCTIONS:
1. Platform Service Tech Levy (12%): -₹700.80
2. Gear Security Deposit (Installment 2/4): -₹450.00
3. Order Return Restocking Fine (Order #49281): -₹250.00
4. Customer Cash Shortage Escrow Adjustment: -₹380.00
5. Customer Rating Remediation Course Fee: -₹150.00
6. TDS @ 1% (Sec 194O): -₹58.40

TOTAL DEDUCTIONS: -₹1,989.20
NET DISBURSED TO BANK ACCOUNT: ₹4,450.80 (Effective loss: 31% of gross earnings)`,
    precomputedResult: {
      id: 'payout-slip-analysis',
      documentTitle: 'Weekly Settlement & Deductions Breakdown',
      documentType: 'payout_slip',
      platformName: 'Logistics Fleet Weekly Settlement',
      safetyScore: 49,
      confidence: 'high',
      summary: 'Aapne ₹6,440 ka kaam kiya par jeb me sirf ₹4,450 aaye! Lagbhag ₹1,989 (31%) kaat liya gaya. Isme ₹250 return fine aur ₹150 "rating course fee" anokhi deductions hain jinki janch zaroori hai.',
      workerAdvocateAdvice: [
        'Hub manager se "Order #49281" ka delivery proof maango ki return ka fine rider par kyu laga jab customer ne door lock kiya tha.',
        '"Rating Remediation Course Fee" (₹150) ka protest karein; company bina consent training fee deduct nahi kar sakti.',
        'Apne cash collection ka screenshot slip ke escrow adjustment se milayein.'
      ],
      redFlagsCount: 2,
      cautionCount: 2,
      safeCount: 2,
      clauses: [
        {
          id: 'ps-c1',
          title: 'Mandatory Customer Rating Remediation Fee (₹150)',
          category: 'penalties',
          riskLevel: 'RISK',
          originalText: 'Customer Rating Remediation Course Fee: -₹150.00',
          plainExplanation: 'Rating kam hone par company ne zabardasti ek online video dekhne ka ₹150 aapke hi payout se kaat liya! Yeh galat aur unfair deduction hai.',
          analogy: 'Jaise school me masterji padhane ki saza me student ki pocket money nikaal lein.',
          actionableTip: 'Support chat me likhein: "I did not consent to a paid training course. Please refund ₹150 immediately."',
          financialImpact: '₹150 illegal training deduction.'
        },
        {
          id: 'ps-c2',
          title: 'Order Return Restocking Fine (₹250)',
          category: 'penalties',
          riskLevel: 'RISK',
          originalText: 'Order Return Restocking Fine (Order #49281): -₹250.00',
          plainExplanation: 'Agar customer ne parcel lene se mana kiya aur aapne parcel store par wapas laya, toh bhi aap par ₹250 ka fine lagaya gaya.',
          analogy: 'Customer ki galti ka jurmana delivery wale ke sar.',
          actionableTip: 'Store return slip ka photo dikha kar Hub incharge se ticket close karwayein.',
          financialImpact: '₹250 deduction on returned item.'
        },
        {
          id: 'ps-c3',
          title: 'Cash Shortage Escrow Adjustment (₹380)',
          category: 'payouts',
          riskLevel: 'CAUTION',
          originalText: 'Customer Cash Shortage Escrow Adjustment: -₹380.00',
          plainExplanation: 'Company ka kehna hai ki COD (Cash On Delivery) me ₹380 kam jama huye. Yeh aksar UPI transaction sync delay ki wajah se hota hai.',
          analogy: 'Hisaab me mismatch aane par sidha salary se kaat lena.',
          actionableTip: 'Apna GPay/PhonePe bank statement nikaal kar hub par mismatch verify karwayein.',
          financialImpact: '₹380 pending verification.'
        },
        {
          id: 'ps-c4',
          title: 'Gear Security Deposit Installment (₹450)',
          category: 'equipment',
          riskLevel: 'CAUTION',
          originalText: 'Gear Security Deposit (Installment 2/4): -₹450.00',
          plainExplanation: 'Yeh bag aur uniform ki doosri kist hai. 4 hafton tak ₹450 katega (kul ₹1,800).',
          analogy: 'Kiston me uniform khareedna.',
          actionableTip: 'Note karein ki 4 kiston ke baad yeh deduction band hona chahiye.',
          financialImpact: '₹450 per week for 4 weeks.'
        },
        {
          id: 'ps-c5',
          title: 'Platform Tech Fee 12%',
          category: 'payouts',
          riskLevel: 'SAFE',
          originalText: 'Platform Service Tech Levy (12%): -₹700.80',
          plainExplanation: 'App chalane aur order dispatch karne ke liye 12% standard platform fee.',
          analogy: 'App use karne ka normal kiraya.',
          actionableTip: 'Check karein ki agreement me tech fee 12% hi likhi thi ya nahi.',
          financialImpact: '12% standard cut.'
        },
        {
          id: 'ps-c6',
          title: 'Government TDS @ 1%',
          category: 'payouts',
          riskLevel: 'SAFE',
          originalText: 'TDS @ 1% (Sec 194O): -₹58.40',
          plainExplanation: 'Sarkari tax jo income tax department me jama hota hai aur refund mil sakta hai.',
          analogy: 'Sarkari bachatt.',
          actionableTip: 'Saal me ITR bhar kar wapas lein.',
          financialImpact: '1% refundable tax.'
        }
      ],
      spokenScripts: {
        hi: {
          language: 'Hindi / Hinglish',
          languageCode: 'hi',
          title: 'पेआउट स्लिप का 60-सेकंड ऑडियो हिसाब',
          scriptText: 'अरे भाई, इस हफ्ते की पेआउट स्लिप ध्यान से देखो! आपकी कुल कमाई ₹6,440 थी, लेकिन बैंक खाते में सिर्फ ₹4,450 आए हैं—यानी पूरे ₹1,989 कट गए! इसमें सबसे चौंकाने वाली बात यह है कि कस्टमर के पार्सल रिटर्न करने पर आप पर ₹250 का फाइन लगा दिया गया और रेटिंग सुधारने के नाम पर ₹150 की ट्रेनिंग फीस काट ली गई। इसके अलावा कैश शॉर्टेज के नाम पर ₹380 काटे गए हैं। तुरंत हब पर जाएं, अपने यूपीआई पेमेंट का स्क्रीनशॉट दिखाएं और स्टोर रिटर्न रसीद दिखाकर ₹400 वापस मांगने की मांग करें!',
          bulletPoints: [
            'कुल कमाई ₹6,440 में से ₹1,989 (31%) की भारी कटौती',
            'पार्सल रिटर्न पर अनुचित ₹250 रीस्टॉकिंग फाइन',
            'बिना सहमति ₹150 की रेटिंग ट्रेनिंग कोर्स फीस काटी गई',
            'कैश शॉर्टेज ₹380 का हिसाब यूपीआई से तुरंत मिलाएं'
          ]
        },
        en: {
          language: 'Simple English',
          languageCode: 'en',
          title: '60-Second Payout Slip Breakdown',
          scriptText: 'Check your payout slip closely! You earned ₹6,440 this week, but only ₹4,450 reached your bank account—meaning nearly 31% (₹1,989) was deducted! The biggest unfair cuts are a ₹250 restocking fee because a customer returned an order, and an unauthorized ₹150 fee for a rating training video. There is also a ₹380 cash shortage deduction. Take your UPI bank statement and store return receipt to the hub manager today and contest these unjustified deductions!',
          bulletPoints: [
            'Gross ₹6,440 reduced to ₹4,450 (31% deducted)',
            '₹250 penalty for customer order return',
            '₹150 unauthorized course deduction',
            '₹380 cash shortage requiring verification'
          ]
        },
        ta: {
          language: 'Tamil',
          languageCode: 'ta',
          title: 'சம்பள ரசீது 60 வினாடி ஆடியோ விவரம்',
          scriptText: 'தோழரே, இந்த வார பேஅவுட் சீட்டை கவனியுங்கள்! நீங்கள் ₹6,440 உழைத்தீர்கள், ஆனால் வங்கிக்கு வந்தது ₹4,450 மட்டுமே. கிட்டத்தட்ட ₹1,989 கழிக்கப்பட்டுள்ளது! இதில் வாடிக்கையாளர் பொருளைத் திருப்பியதற்கு ₹250 அபராதமும், ரேட்டிங் பயிற்சிக் கட்டணமாக ₹150-ம் அநியாயமாகப் பிடிக்கப்பட்டுள்ளது. உங்கள் யூபிஐ ஆதாரத்தைக் காட்டி ஹப் மேனேஜரிடம் இந்த ₹400-ஐ உடனடியாகத் திருப்பித் தருமாறு கேளுங்கள்!',
          bulletPoints: [
            'மொத்த வருமானத்தில் 31% பிடித்தம்',
            'பொருள் திரும்பியதற்கு ₹250 அபராதம்',
            'பயிற்சி என்ற பெயரில் ₹150 பிடித்தம்'
          ]
        },
        te: {
          language: 'Telugu',
          languageCode: 'te',
          title: 'పేఅవుట్ స్లిప్ 60 సెకన్ల ఆడియో విశ్లేషణ',
          scriptText: 'సోదరా, ఈ వారం పేఅవుట్ స్లిప్ చూడండి! మీరు సంపాదించిన ₹6,440 లో బ్యాంక్ అకౌంట్‌కు ₹4,450 మాత్రమే వచ్చింది. ఏకంగా ₹1,989 కట్ అయింది! కస్టమర్ ఆర్డర్ తీసుకోకపోతే ₹250 ఫైన్ వేశారు, రేటింగ్ ట్రైనింగ్ పేరుతో ₹150 కట్ చేశారు. మీ యూపీఐ ప్రూఫ్ చూపించి హబ్‌లో ఈ డబ్బును రీఫండ్ అడగండి!',
          bulletPoints: [
            'సంపాదనలో 31% కోత',
            'రిటర్న్ ఆర్డర్‌పై ₹250 జరిమానా',
            'రేటింగ్ ట్రైనింగ్ పేరుతో ₹150 కోత'
          ]
        },
        mr: {
          language: 'Marathi',
          languageCode: 'mr',
          title: 'पेआउट स्लिप ६० सेकंदांचा अहवाल',
          scriptText: 'भावांनो, या आठवड्याची पेआउट स्लिप तपासा! तुम्ही ₹६,४४० कमवले, पण खात्यात फक्त ₹४,४५० आले. ₹१,९८९ कापले गेले! पार्सल परत आल्यावर ₹२५० चा दंड आणि रेटिंगच्या नावाखाली ₹१५० ची फी कापली गेली आहे. हबवर जाऊन हिशोब तपासा!',
          bulletPoints: [
            'कमाईतून ३१% मोठी कपात',
            'रिटर्न ऑर्डरवर ₹२५० चा दंड',
            'ट्रेनिंग फीच्या नावाखाली ₹१५० कपात'
          ]
        },
        bn: {
          language: 'Bengali',
          languageCode: 'bn',
          title: 'পেআউট স্লিপের ৬০ সেকেন্ডের হিসেব',
          scriptText: 'ভাই, পেআউট স্লিপটি ভালো করে দেখুন! আপনি ₹৬,৪৪০ উপার্জন করেছিলেন, কিন্তু অ্যাকাউন্টে এসেছে মাত্র ₹৪,৪৫০। প্রায় ₹১,৯৮৯ কেটে নেওয়া হয়েছে! পার্সেল ফেরতের জন্য ₹২৫০ জরিমানা এবং রেটিং কোর্সের নামে ₹১৫০ কাটা হয়েছে। অবিলম্বে হাব ম্যানেজারের কাছে এর জবাব চান!',
          bulletPoints: [
            'উপার্জনের ৩১% কর্তন',
            'অর্ডার ফেরতে ₹২৫০ জরিমানা',
            'ট্রেনিংয়ের নামে ₹১৫০ কাটা'
          ]
        },
        kn: {
          language: 'Kannada',
          languageCode: 'kn',
          title: 'ಪೇಔಟ್ ಸ್ಲಿಪ್ 60 ಸೆಕೆಂಡಿನ ವಿವರಣೆ',
          scriptText: 'ಸ್ನೇಹಿತರೇ, ಈ ವಾರದ ಪೇಔಟ್ ಸ್ಲಿಪ್ ಪರಿಶೀಲಿಸಿ! ನೀವು ₹6,440 ಗಳಿಸಿದರೂ ಕೈಗೆ ಬಂದಿದ್ದು ₹4,450 ಮಾತ್ರ. ₹1,989 ಕಡಿತವಾಗಿದೆ! ರಿಟರ್ನ್ ಆದ ಆರ್ಡರ್‌ಗೆ ₹250 ದಂಡ ಮತ್ತು ತರಬೇತಿ ಹೆಸರಿನಲ್ಲಿ ₹150 ಕಡಿತಗೊಳಿಸಲಾಗಿದೆ!',
          bulletPoints: [
            'ಗಳಿಕೆಯಲ್ಲಿ 31% ಕಡಿತ',
            'ರಿಟರ್ನ್ ಆರ್ಡರ್‌ಗೆ ₹250 ದಂಡ'
          ]
        }
      },
      workerQuestionsToAsk: [
        '"अगर कस्टमर ने फोन नहीं उठाया और मैंने पार्सल हब पर रिटर्न किया, तो ₹250 का फाइन मुझपर क्यों लगाया गया?"',
        '"Rating Remediation Course Fee (₹150) काटने से पहले मुझसे पूछा क्यों नहीं गया? क्या यह ऐप पर फ्री नहीं होना चाहिए?"',
        '"Cash Shortage Escrow Adjustment (₹380) किस ऑर्डर का है, मुझे उसका ऑर्डर आईडी और टाइमस्टैम्प दिखाइए।"'
      ],
      analyzedAt: new Date().toISOString()
    }
  },
  {
    id: 'home-services-partner',
    name: 'Home Services Partner Policy (Salon / Electrician / AC)',
    categoryBadge: 'Home Services',
    platform: 'Urban Company / Housejoy Style',
    description: 'Deconstructs mandatory product kit repurchases, customer 1-star penalty fees, and restrictive 5km non-compete clauses.',
    rawText: `HOME SERVICE PROFESSIONAL STANDARD OPERATING CHARTER
1. MANDATORY PRODUCT CONSUMABLES: The Service Professional shall exclusively procure all cosmetic, chemical, and cleaning kits from the Platform's authorized commissary store at specified prices (minimum monthly consumable quota: ₹4,500). Use of non-authorized materials constitutes material breach resulting in forfeiture of the ₹10,000 onboarding security bond.
2. CUSTOMER RATING ESCALATIONS & PENALTIES: Where a customer awards a 1-star rating citing service dissatisfaction, a quality penalty fee of ₹500 shall be debited from the Professional's ledger, and the partner must attend a 3-day unpaid skill refresher workshop.
3. EXCLUSIVITY & NON-COMPETE: The Professional agrees not to directly or indirectly solicit, provide private services to, or accept offline business from any customer introduced via the Platform within a radius of 5 kilometers for a period of 12 months following disassociation. Breach of this covenant invokes liquidated damages of ₹50,000.
4. INDEMNIFICATION OF PROPERTY DAMAGE: The Professional accepts 100% financial liability for any accidental property breakage, tile staining, or electrical short circuit occurring inside customer premises during service execution.`,
    precomputedResult: {
      id: 'home-services-analysis',
      documentTitle: 'Home Service Professional Operating Charter',
      documentType: 'policy_update',
      platformName: 'Home Services Platform (Urban Company Style)',
      safetyScore: 31,
      confidence: 'high',
      summary: 'Khatarnak clauses: Har mahine ₹4,500 ka samaan company se khareedna compulsory hai, customer ke 1-star par ₹500 fine aur 3 din ki bina kamai wali training, aur kaam chhodne par 5km ke andar private kaam karne par ₹50,000 ka case karne ki dhamki!',
      workerAdvocateAdvice: [
        'Har mahine ₹4,500 ka kit lene ka quota aapki aamdani se zyada kharcha kara sakta hai; hub se minimum kit requirement clarify karein.',
        'Customer ke ghar kaam shuru karne se pehle puraane toot-phoot ya pehle se kharab switch/tile ka photo lein taaki damage liability aap par na daali jaye.',
        '₹50,000 non-compete clause Indian Contract Act Section 27 ke tahat generally illegal/unenforceable hota hai, darne ki zaroorat nahi hai par dhyan rakhein.'
      ],
      redFlagsCount: 3,
      cautionCount: 1,
      safeCount: 0,
      clauses: [
        {
          id: 'hs-c1',
          title: '₹50,000 Non-Compete Penalty for Offline Clients',
          category: 'legal',
          riskLevel: 'RISK',
          originalText: 'The Professional agrees not to directly or indirectly provide private services to any customer introduced via the Platform within a radius of 5 kilometers for a period of 12 months. Breach invokes liquidated damages of ₹50,000.',
          plainExplanation: 'Agar aapne platform chhod diya, toh bhi aap 1 saal tak 5 kilometer ke daayre me un customers ke ghar private kaam nahi kar sakte, warna ₹50,000 jurmane ka claim company karegi.',
          analogy: 'Aapki apni hunar aur haath ki mehnat par company apna tala lagana chahti hai.',
          actionableTip: 'Bina platform ke customer se direct phone par payment lene me savdhaan rahein.',
          financialImpact: 'Threat of ₹50,000 legal claim.'
        },
        {
          id: 'hs-c2',
          title: '100% Property Damage Liability on Worker',
          category: 'insurance',
          riskLevel: 'RISK',
          originalText: 'The Professional accepts 100% financial liability for any accidental property breakage, tile staining, or electrical short circuit occurring inside customer premises.',
          plainExplanation: 'Agar customer ke purane geyser ya sofa me kaam karte waqt thoda bhi nuksan hua, toh pura kharcha aapko bharna padega; company ka koi insurance coverage nahi hoga.',
          analogy: 'Ghar ka repair karte waqt company munafa legi, par galti se tile tooti toh sara bill worker bharega.',
          actionableTip: 'Kaam shuru karne se pehle customer ke saamne purane damages ka video zaroor bana kar phone me rakhein.',
          financialImpact: 'Uncapped financial liability (₹5,000 - ₹50,000).'
        },
        {
          id: 'hs-c3',
          title: 'Mandatory Monthly ₹4,500 Product Kit Purchase',
          category: 'equipment',
          riskLevel: 'RISK',
          originalText: 'Minimum monthly consumable quota: ₹4,500. Use of non-authorized materials constitutes material breach resulting in forfeiture of the ₹10,000 onboarding security bond.',
          plainExplanation: 'Chahe aapko kaam kam mile ya zyada, har mahine ₹4,500 ka product kit company ki dukaan se hi lena padega. Bahar se saste me lia toh ₹10,000 security deposit zapt ho jayega.',
          analogy: 'Company aapko kaam dene ke bahane khud apna samaan bech kar aapse hi kamayi kar rahi hai.',
          actionableTip: 'Monthly stock balance ka register banayein taaki unutilized inventory expire na ho.',
          financialImpact: 'Fixed ₹4,500 monthly expense regardless of actual bookings.'
        },
        {
          id: 'hs-c4',
          title: '1-Star Quality Penalty (₹500 + 3 Days Unpaid Retraining)',
          category: 'penalties',
          riskLevel: 'CAUTION',
          originalText: 'Where a customer awards a 1-star rating citing service dissatisfaction, a quality penalty fee of ₹500 shall be debited from the Professional\'s ledger, and the partner must attend a 3-day unpaid skill refresher workshop.',
          plainExplanation: 'Agar kisi customer ne 1-star diya, toh ₹500 katega aur 3 din bina kisi kamai ke training attend karni padegi—yaani 3 din ki daily wage ka pura loss.',
          analogy: 'Danda bhi, jurmana bhi aur kamai par 3 din ki rok bhi.',
          actionableTip: 'Service khatam hone par customer ko kaam dikhayein aur unke saamne hi OTP/approval lein.',
          financialImpact: '₹500 direct fine + ~₹3,000 lost earnings across 3 days.'
        }
      ],
      spokenScripts: {
        hi: {
          language: 'Hindi / Hinglish',
          languageCode: 'hi',
          title: 'होम सर्विस वर्कर्स के लिए 60-सेकंड की ऑडियो रिपोर्ट',
          scriptText: 'नमस्ते सर्विस पार्टनर! इस नए ऑपरेटिंग चार्टर में आपके लिए गंभीर खतरे हैं। पहला—हर महीने ₹4,500 का सामान कंपनी के स्टोर से खरीदना अनिवार्य है, अगर बाहर से लिया तो ₹10,000 की सिक्योरिटी जब्त हो जाएगी। दूसरा—कस्टमर के घर काम करते वक्त अगर कोई भी पुरानी टाइल या सामान टूटा, तो 100% नुकसान आपकी जेब से भरा जाएगा। तीसरा—कस्टमर ने 1-स्टार रेटिंग दी तो ₹500 पेनल्टी और 3 दिन बिना कमाई ट्रेनिंग करनी पड़ेगी। काम शुरू करने से पहले ग्राहक के घर की पुरानी टूट-फूट का वीडियो अपने फोन में जरूर बनाएं!',
          bulletPoints: [
            'हर महीने ₹4,500 का सामान खरीदना अनिवार्य',
            'कस्टमर के घर टूट-फूट की 100% देनदारी वर्कर पर',
            '1-स्टार रेटिंग पर ₹500 जुर्माना व 3 दिन की unpaid ट्रेनिंग',
            'काम छोड़ने पर 5km के अंदर काम करने पर ₹50,000 के केस की धमकी'
          ]
        },
        en: {
          language: 'Simple English',
          languageCode: 'en',
          title: '60-Second Audio Brief for Service Professionals',
          scriptText: 'Notice for home service professionals! This charter contains severe burdens. You are forced to buy ₹4,500 worth of company supplies every month or risk losing your ₹10,000 security deposit. If any item or fixture breaks at the customer home, you must pay 100% of the cost. A single 1-star rating results in a ₹500 penalty and 3 days of mandatory unpaid training. Always film pre-existing property conditions before starting any job!',
          bulletPoints: [
            'Mandatory ₹4,500 monthly product kit purchase quota',
            '100% personal liability for property damage at client site',
            '₹500 fine and 3 days unpaid retraining on 1-star rating',
            'Restrictive non-compete threatening ₹50,000 penalty'
          ]
        },
        ta: {
          language: 'Tamil',
          languageCode: 'ta',
          title: 'ஹோம் சர்வீஸ் பணியாளர்களுக்கான 60 வினாடி ஆடியோ விளக்கம்',
          scriptText: 'வணக்கம் நண்பரே! இந்த ஒப்பந்தத்தில் மாதம் ₹4,500 மதிப்புள்ள பொருட்களை நிறுவனத்திடமே வாங்க வேண்டும் என்ற கட்டாயம் உள்ளது. வாடிக்கையாளர் வீட்டில் ஏதேனும் உடைந்தால் முழு நஷ்டத்தையும் நீங்களே ஏற்க வேண்டும். ஒரு முறை 1-ஸ்டார் ரேட்டிங் வந்தால் ₹500 அபராதமும், 3 நாட்கள் ஊதியமில்லா பயிற்சியும் உண்டு. வாடிக்கையாளர் வீட்டில் வேலையைத் தொடங்கும் முன் பழைய சேதங்களை வீடியோ எடுங்கள்!',
          bulletPoints: [
            'மாதம் ₹4,500 பொருட்கள் வாங்க கட்டாயம்',
            'சேதங்களுக்கு 100% தனிநபர் பொறுப்பு',
            '1-ஸ்டார் ரேட்டிங்கிற்கு ₹500 அபராதம்'
          ]
        },
        te: {
          language: 'Telugu',
          languageCode: 'te',
          title: 'హోమ్ సర్వీస్ వర్కర్ల కోసం 60 సెకన్ల ఆడియో సమాచారం',
          scriptText: 'నమస్కారం సోదరా! ఈ నిబంధనలలో ప్రతినెలా ₹4,500 సామాగ్రిని కంపెనీ వద్దే కొనాలి. కస్టమర్ ఇంట్లో ఏదైనా పాడైతే పూర్తి నష్టాన్ని మీరే భరించాలి. ఒక్క 1-స్టార్ రేటింగ్ వస్తే ₹500 జరిమానా మరియు 3 రోజులు ఉచితంగా శిక్షణకు వెళ్లాలి. పని మొదలుపెట్టే ముందే కస్టమర్ ఇంట్లోని స్థితిని వీడియో తీయండి!',
          bulletPoints: [
            'ప్రతినెలా ₹4,500 సామాగ్రి కొనడం తప్పనిసరి',
            'కస్టమర్ ఇంట్లోని నష్టాలకు 100% వర్కర్‌దే బాధ్యత',
            '1-స్టార్ రేటింగ్‌పై ₹500 జరిమానా'
          ]
        },
        mr: {
          language: 'Marathi',
          languageCode: 'mr',
          title: 'होम सर्व्हिस वर्कर्ससाठी ६० सेकंदांचा अहवाल',
          scriptText: 'नमस्कार मित्रांनो! दरमहा ₹४,५०० चे सामान कंपनीकडूनच खरेदी करणे बंधनकारक आहे. ग्राहकाच्या घरात काही तुटल्यास १००% नुकसान भरपाई तुम्हाला द्यावी लागेल. १-स्टार रेटिंगवर ₹५०० दंड आणि ३ दिवस विनावेतन ट्रेनिंग आहे. काम सुरू करण्यापूर्वी ग्राहकाच्या घरातील आधीच्या नुकसानीचा व्हिडिओ काढा!',
          bulletPoints: [
            'दरमहा ₹४,५०० चे सामान घेणे बंधनकारक',
            'घरातील नुकसानीची १००% जबाबदारी कामगारावर',
            '१-स्टार रेटिंगवर ₹५०० दंड'
          ]
        },
        bn: {
          language: 'Bengali',
          languageCode: 'bn',
          title: 'হোম সার্ভিস কর্মীদের জন্য ৬০ সেকেন্ডের অডিও ব্রিফ',
          scriptText: 'নমস্কার সার্ভিস পার্টনার! এই সনদে প্রতি মাসে ₹৪,৫০০ টাকার সামগ্রী কোম্পানি থেকে কেনা বাধ্যতামূলক করা হয়েছে। কাস্টমারের বাড়িতে কোনো ক্ষতি হলে ১০০% দায়ভার আপনার। ১-স্টার রেটিং পেলে ₹৫০০ জরিমানা ও ৩ দিন বিনা উপার্জনে ট্রেনিং করতে হবে। কাজ শুরুর আগে কাস্টমারের ঘরের ভিডিও করে রাখুন!',
          bulletPoints: [
            'মাসে ₹৪,৫০০ টাকার সামগ্রী কেনা বাধ্যতামূলক',
            'বাড়ির ক্ষতির ১০০% দায়ভার শ্রমিকের',
            '১-স্টার রেটিংয়ে ₹৫০০ জরিমানা'
          ]
        },
        kn: {
          language: 'Kannada',
          languageCode: 'kn',
          title: 'ಹೋಮ್ ಸರ್ವಿಸ್ ಪಾಲುದಾರರಿಗೆ 60 ಸೆಕೆಂಡಿನ ವಿವರಣೆ',
          scriptText: 'ನಮಸ್ಕಾರ ಸ್ನೇಹಿತರೇ! ಪ್ರತಿ ತಿಂಗಳು ₹4,500 ಸಾಮಗ್ರಿಗಳನ್ನು ಕಂಪನಿಯಿಂದಲೇ ಖರೀದಿಸಬೇಕು. ಗ್ರಾಹಕರ ಮನೆಯಲ್ಲಿ ಏನಾದರೂ ಹಾನಿಯಾದರೆ ನೀವೇ 100% ಭರಿಸಬೇಕು. 1-ಸ್ಟಾರ್ ರೇಟಿಂಗ್ ಬಂದರೆ ₹500 ದಂಡ ಮತ್ತು 3 ದಿನ ವೇತನವಿಲ್ಲದೆ ತರಬೇತಿಗೆ ಹೋಗಬೇಕು!',
          bulletPoints: [
            'ತಿಂಗಳಿಗೆ ₹4,500 ಸಾಮಗ್ರಿ ಖರೀದಿ ಕಡ್ಡಾಯ',
            'ಆಸ್ತಿ ಹಾನಿಗೆ 100% ವೈಯಕ್ತಿಕ ಹೊಣೆಗಾರಿಕೆ'
          ]
        }
      },
      workerQuestionsToAsk: [
        '"अगर किसी महीने मुझे कम बुकिंग्स मिलीं, तो क्या फिर भी ₹4,500 का सामान खरीदना ज़रूरी होगा?"',
        '"कस्टमर के पुराने सामान में पहले से मौजूद टूट-फूट का क्लेम मुझपर ना आए, इसके लिए ऐप में प्री-वर्क इंस्पेक्शन फोटो अपलोड करने का विकल्प क्यों नहीं है?"',
        '"Section 27 of Indian Contract Act के तहत जो 5km नॉन-कंपीट क्लॉज है, क्या वह कानूनी रूप से सही है?"'
      ],
      analyzedAt: new Date().toISOString()
    }
  }
];
