import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Upload, Camera, Shirt, Tag } from 'lucide-react';

export default function Component() {
  const [images, setImages] = useState({
    fullPhoto: '',
    printLocation: '',
    neckLabel: '',
    cadWithNeckLabel: ''
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImages(prev => ({ ...prev, [key]: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const exportToPDF = () => {
    const input = document.getElementById('photoLayout');
    html2canvas(input as HTMLElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save("modern_photo_press_check.pdf");
    });
  };

  return (
    <div className="container mx-auto p-4 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 min-h-screen">
      <Card className="mb-4 overflow-hidden shadow-2xl">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Photo Press Check Requirements
          </h1>
          <div id="photoLayout" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[
              { key: 'fullPhoto', title: 'FULL PHOTO OF GARMENT', icon: <Shirt className="w-6 h-6" /> },
              { key: 'printLocation', title: 'CLOSE UP OF EACH PRINT LOCATION', icon: <Camera className="w-6 h-6" /> },
              { key: 'neckLabel', title: 'CLOSE UP OF NECK LABEL PRINT', icon: <Tag className="w-6 h-6" /> },
              { key: 'cadWithNeckLabel', title: 'GTS CAD WITH NECK LABEL ART', icon: <Upload className="w-6 h-6" /> }
            ].map((item, index) => (
              <Card key={item.key} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-4">
                  <Label htmlFor={item.key} className="flex items-center gap-2 mb-3 font-bold text-lg text-gray-700">
                    {item.icon}
                    <span>{`${index + 1}. ${item.title}`}</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id={item.key}
                      type="file"
                      onChange={(e) => handleImageUpload(e, item.key)}
                      className="hidden"
                    />
                    <Button
                      onClick={() => document.getElementById(item.key)?.click()}
                      className="w-full mb-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      Choose File
                    </Button>
                  </div>
                  {images[item.key as keyof typeof images] && (
                    <div className="mt-4 rounded-lg overflow-hidden border-4 border-purple-300">
                      <img
                        src={images[item.key as keyof typeof images]}
                        alt={item.title}
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <Button
            onClick={exportToPDF}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Export to PDF
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
