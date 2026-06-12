import { useState, useRef, useCallback } from 'react';
import { message, Form } from 'antd';
import { reportService } from '../services/reportService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import dayjs from 'dayjs';

interface ReportData {
  all_time_users: number;
  all_time_tests: number;
  new_users: number;
  new_tests: number;
  user_chart: { date: string; count: number }[];
}

export const useReport = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [dateRangeStr, setDateRangeStr] = useState<string>('');
  const printRef = useRef<HTMLDivElement>(null);

  const handleGenerateReport = useCallback(async (values: any) => {
    const { dates } = values;
    if (!dates || dates.length !== 2) {
      message.warning('Vui lòng chọn khoảng thời gian cụ thể!');
      return;
    }

    const startDate = dates[0].format('YYYY-MM-DD');
    const endDate = dates[1].format('YYYY-MM-DD');
    setDateRangeStr(`${dates[0].format('DD/MM/YYYY')} - ${dates[1].format('DD/MM/YYYY')}`);

    setLoading(true);
    try {
      const response = await reportService.generateReport(startDate, endDate);
      setReportData(response.data.data);
      message.success('Tạo báo cáo thành công!');
    } catch (error) {
      console.error('Lỗi khi tạo báo cáo:', error);
      message.error('Không thể tạo báo cáo. Vui lòng thử lại sau!');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleExportPDF = useCallback(async () => {
    if (!printRef.current || !reportData) {
      message.warning('Vui lòng tạo báo cáo trước khi xuất PDF!');
      return;
    }

    try {
      const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Bao_cao_52Hz_${dayjs().format('DDMMYYYY')}.pdf`);
      message.success('Xuất file PDF thành công!');
    } catch (error) {
      console.error('Lỗi xuất PDF:', error);
      message.error('Không thể xuất file PDF.');
    }
  }, [reportData]);

  const handlePrint = useCallback(() => {
    if (!reportData) {
      message.warning('Vui lòng tạo báo cáo trước khi in!');
      return;
    }
    window.print();
  }, [reportData]);

  return {
    form,
    loading,
    reportData,
    dateRangeStr,
    printRef,
    handleGenerateReport,
    handleExportPDF,
    handlePrint
  };
};
