'ue client';
import html2canvas from 'html2canvas';
import { useRef, useState } from 'react';
export const useExportImage = ({ imageName = 'exported-image' }) => {
  const componentRef = useRef();
  const [isExporting, setIsExporing] = useState(false);

  const handleExport = async () => {
    if (!componentRef.current) return;

    setIsExporing(true);
    try {
      const canvas = await html2canvas(componentRef.current, {
        useCORS: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: componentRef?.current?.scrollWidth,
        windowHeight: componentRef?.current?.scrollHeight,
        backgroundColor: 'black',
      });
      const link = document.createElement('a');
      link.download = `${imageName}.png`;
      link.href = canvas.toDataURL();
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
