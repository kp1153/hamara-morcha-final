import { notFound } from "next/navigation";

// टीम डेटा
const teamMembers = [
  {
    id: 1,
    name: "माननीय चीकू सिंह बुंदेला",
    role: "संरक्षक",
    photo: "/images/1.jpg",
    slug: "chiku-singh-bundela",
  },
  {
    id: 2,
    name: "दिगंत शुक्ल",
    role: "प्रधान संपादक",
    photo: "/images/2.jpg",
    slug: "digant-shukla",
  },
  {
    id: 3,
    name: "अद्वय शुक्ल",
    role: "संपादक",
    photo: "/images/3.jpg",
    slug: "advay-shukla",
  },
  {
    id: 4,
    name: "कामता प्रसाद",
    role: "कार्यकारी संपादक",
    photo: "/images/4.jpg",
    address: "तिवारी भवन, ग्रामः गहरपुर, पोस्टः पुआरीकलां -221202, वाराणसी।",
    phone: "9996865069",
    email: "hamaramorcha1153@gmail.com",
    slug: "kamta-prasad",
  },
  {
    id: 5,
    name: "सुमन तिवारी",
    role: "प्रबंध निदेशक",
    photo: "/images/5.jpg",
    slug: "suman-tiwari",
  },
  {
    id: 6,
    name: "अखिलेश चौधरी",
    role: "सीनियर रिपोर्टर",
    photo: "/images/6.jpg",
    phone: "77540 93975",
    slug: "akhilesh-chaudhary",
  },
];

export default async function TeamMemberPage({ params }) {
  const { slug } = await params; // ✅ Next.js 15.4 के लिए async destructuring

  const member = teamMembers.find((m) => m.slug === slug);

  if (!member) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-3xl mx-auto text-center">
        <img
          src={member.photo}
          alt={member.name}
          className="w-64 h-80 object-cover rounded-lg mx-auto mb-6 shadow-lg"
        />
        <h1 className="text-3xl font-bold mb-2">{member.name}</h1>
        <p className="text-orange-400 font-semibold mb-4">{member.role}</p>
        {member.address && <p className="mb-2">📍 {member.address}</p>}
        {member.phone && <p className="mb-2">📞 {member.phone}</p>}
        {member.email && <p className="mb-2">✉️ {member.email}</p>}
      </div>
    </div>
  );
}
