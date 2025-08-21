const Footer = () => {
  return (
    <footer className="bg-green-700 text-white text-sm mt-10 border-t border-gray-300">
      <div className="max-w-5xl mx-auto px-4 py-6 text-justify leading-relaxed space-y-4">
        <p>
          <strong>हमारा मोर्चा</strong> के संचालक और कार्यकारी संपादक{" "}
          <strong>कामता प्रसाद</strong> Next.js पर वेबसाइट बनाने का काम करते हैं
          और यही उनकी आजीविका का जरिया है। <strong>हमारा मोर्चा</strong> को
          बनाने के लिए उन्होंने HTML, CSS और JavaScript सीखी। फिर Tailwind CSS,
          React.js, Node.js पर हाथ साफ किया और Next.js 15 की जमकर प्रैक्टिस की
          और अभी भी कर ही रहे हैं। इस तरह से इंडस्ट्री स्टैंडर्ड पर खुद को खरा
          उतारने के लिए दिन-रात एक किए हुए हैं।{" "}
          <strong className="text-white">
            चूँकि कामता प्रसाद हिंदी-अंग्रेजी के अलावा उर्दू भी जानते हैं तो
            कांटेंट राइटिंग में भी आप उनसे मदद ले सकते हैं।
          </strong>{" "}
          बस, आम लोगों की जानकारी के लिए, नेक्स्ट.जेएस पर बनी वेबसाइट वर्सेल पर
          मुफ्त में होस्ट हो सकती है वर्ना बाजार में ठग बैठे हैं और हर साल आपसे
          पैसा वसूलेंगे, जबकि मैं सिर्फ एक बार पारिश्रमिक लूँगा और ताला-कुंजी सब
          आपके हवाले कर दूँगा।
        </p>

        <p className="text-white font-bold bg-[#2e0077] p-2 rounded">
          अगर आपको Multi-languages यानि कि एक से अधिक भाषाओं में सामग्री दिखाने
          वाली वेबसाइट बनवानी है और इस संबंध में विस्तार से जानकारी चाहते हैं तो
          कृपया क्लिक करें:{" "}
          <a
            href="https://www.web-developer-kp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline hover:text-blue-200 font-semibold"
          >
            https://www.web-developer-kp.com/ ध्यान रहे मैं अनुभवी अनुवादक हूँ
            और हमेशा टीम के साथ मिलकर काम करता रहा हूँ। मेरी टीम में सभी भारतीय
            भाषाओं के कुशल अनुवादक हैं। समस्त यूरोपीय भाषाओं में भी कांटेंट को
            ट्रांसलेट करवा दूँगा, लेकिन आपको उसके लिए अलग से भुगतान करना होगा।
          </a>
        </p>

        <p className="text-center text-base font-semibold">
          संपर्क:{" "}
          <a
            href="mailto:hamaramorcha1153@gmail.com"
            className="text-white hover:underline"
          >
            hamaramorcha1153@gmail.com
          </a>
          , मो.{" "}
          <a href="tel:9996865069" className="text-white hover:underline">
            9996865069
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
