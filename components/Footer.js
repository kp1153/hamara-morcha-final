const Footer = () => {
  return (
    <footer className="bg-white text-blue-700 text-sm mt-10 border-t border-gray-300">
      <div className="max-w-5xl mx-auto px-4 py-6 text-justify leading-relaxed space-y-4">
        <p>
          <strong>हमारा मोर्चा</strong> के संचालक और कार्यकारी संपादक{" "}
          <strong>कामता प्रसाद</strong> Next.js पर वेबसाइट बनाने का काम करते हैं
          और यही उनकी आजीविका का जरिया है। <strong>हमारा मोर्चा</strong> को
          बनाने के लिए उन्होंने HTML, CSS और JavaScript सीखी। फिर Tailwind CSS,
          React.js, Node.js पर हाथ साफ किया और Next.js 15 की जमकर प्रैक्टिस की
          और अभी भी कर ही रहे हैं। उन्होंने JavaScript के सुपरसेट TypeScript पर
          भी हाथ साफ किया और इस तरह से इंडस्ट्री स्टैंडर्ड पर खुद को खरा उतारने
          के लिए दिन-रात एक किए हुए हैं।{" "}
          <strong className="text-indigo-600">
            चूँकि कामता प्रसाद हिंदी-अंग्रेजी के अलावा उर्दू भी जानते हैं तो
            कांटेंट राइटिंग में भी आप उनसे मदद ले सकते हैं।
          </strong>{" "}
          बस, आम लोगों की जानकारी के लिए, नेक्स्ट.जेएस पर बनी वेबसाइट वर्सेल पर
          मुफ्त में होस्ट हो सकती है वर्ना बाजार में ठग बैठे हैं और हर साल आपसे
          पैसा वसूलेंगे, जबकि मैं सिर्फ एक बार मजदूरी लूँगा और ताला-कुंजी सब
          आपके हवाले कर दूँगा।
        </p>

        <p className="text-center text-base font-semibold">
          संपर्क:{" "}
          <a
            href="mailto:hamaramorcha1153@gmail.com"
            className="text-green-800 hover:underline"
          >
            hamaramorcha1153@gmail.com
          </a>
          , मो.{" "}
          <a href="tel:9996865069" className="text-black hover:underline">
            9996865069
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
