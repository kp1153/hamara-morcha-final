// components/CreateNewsForm.tsx
import { createNews } from '../lib/newsService';

export default function CreateNewsForm() {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    await createNews({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      category: formData.get('category') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}