import { toPng } from 'html-to-image';
import { useRef, useState } from 'react';
export const useExportImage = ({ imageName = 'exported-image' }) => {
  const componentRef = useRef();
  const [isExporting, setIsExporing] = useState(false);

  const handleExport = async () => {
    if (!componentRef.current) return;
    setIsExporing(true);
    try {
      const dataUrl = await toPng(componentRef.current, {
        cacheBust: true,
        width: 420,
        height: 800,
        style: {
          width: '420px',
          height: '800px',
          padding: '1.5rem',
          borderRadius: '12px',
          backgroundColor: 'black',
        },
      });

      const link = document.createElement('a');
      link.download = `${imageName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsExporing(false);
    }
  };
  return {
    componentRef,
    handleExport,
    isExporting,
  };
};
