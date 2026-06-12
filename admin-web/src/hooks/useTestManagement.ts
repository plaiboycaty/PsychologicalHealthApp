import { useState, useCallback, useEffect } from 'react';
import { message, Form } from 'antd';
import { testService } from '../services/testService';

export const useTestManagement = () => {
  // --- TEST STATE ---
  const [tests, setTests] = useState<any[]>([]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<any>(null);
  const [testForm] = Form.useForm();

  // --- QUESTION STATE ---
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [questionForm] = Form.useForm();

  // ===================== TESTS =====================
  const fetchTests = useCallback(async () => {
    setLoadingTests(true);
    try {
      const res = await testService.getAllTests();
      setTests(res.data.data);
    } catch (error) {
      message.error('Lỗi tải danh sách bài test');
    } finally {
      setLoadingTests(false);
    }
  }, []);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  const openTestModal = (test?: any) => {
    setEditingTest(test || null);
    if (test) {
      testForm.setFieldsValue({ name: test.name, description: test.description });
    } else {
      testForm.resetFields();
    }
    setIsTestModalOpen(true);
  };

  const handleSaveTest = async () => {
    try {
      const values = await testForm.validateFields();
      setLoadingTests(true);
      if (editingTest) {
        await testService.updateTest(editingTest.id, values);
        message.success('Cập nhật bài test thành công!');
      } else {
        await testService.createTest(values);
        message.success('Thêm bài test thành công!');
      }
      setIsTestModalOpen(false);
      fetchTests();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingTests(false);
    }
  };

  const handleDeleteTest = async (id: number) => {
    try {
      setLoadingTests(true);
      await testService.deleteTest(id);
      message.success('Đã xóa bài test');
      fetchTests();
    } catch (error) {
      message.error('Lỗi khi xóa bài test');
      setLoadingTests(false);
    }
  };

  // ===================== QUESTIONS =====================
  const openQuestionDrawer = (testId: number) => {
    setSelectedTestId(testId);
    setIsDrawerOpen(true);
    fetchQuestions(testId);
  };

  const closeQuestionDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedTestId(null);
    setQuestions([]);
  };

  const fetchQuestions = async (testId: number) => {
    setLoadingQuestions(true);
    try {
      const res = await testService.getQuestionsByTest(testId);
      // Backend returns options as JSON string, we need to parse it if it's a string
      const parsedData = res.data.data.map((q: any) => ({
        ...q,
        options: typeof q.options === 'string' ? JSON.parse(q.options) : q.options
      }));
      setQuestions(parsedData);
    } catch (error) {
      console.error('Lỗi tải danh sách câu hỏi:', error);
      message.error('Lỗi tải danh sách câu hỏi');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const openQuestionModal = (question?: any) => {
    setEditingQuestion(question || null);
    if (question) {
      questionForm.setFieldsValue({
        content: question.content,
        question_order: question.question_order,
        options: question.options
      });
    } else {
      questionForm.resetFields();
      // Default 2 options
      questionForm.setFieldsValue({ options: [{ content: '', score: 0 }, { content: '', score: 1 }] });
    }
    setIsQuestionModalOpen(true);
  };

  const handleSaveQuestion = async () => {
    if (!selectedTestId) return;
    try {
      const values = await questionForm.validateFields();
      if (!values.options || values.options.length < 2) {
        message.error('Mỗi câu hỏi phải có ít nhất 2 đáp án!');
        return;
      }

      setLoadingQuestions(true);
      const payload = {
        test_id: selectedTestId,
        content: values.content,
        question_order: values.question_order || 1,
        options: values.options
      };

      if (editingQuestion) {
        await testService.updateQuestion(editingQuestion.id, payload);
        message.success('Cập nhật câu hỏi thành công!');
      } else {
        await testService.createQuestion(payload);
        message.success('Thêm câu hỏi thành công!');
      }
      setIsQuestionModalOpen(false);
      fetchQuestions(selectedTestId);
    } catch (error) {
      console.error(error);
      setLoadingQuestions(false);
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    if (!selectedTestId) return;
    try {
      setLoadingQuestions(true);
      await testService.deleteQuestion(id);
      message.success('Đã xóa câu hỏi');
      fetchQuestions(selectedTestId);
    } catch (error) {
      message.error('Lỗi khi xóa câu hỏi');
      setLoadingQuestions(false);
    }
  };

  const handleCloneOptions = () => {
    const lastQuestion = questions.length > 0 ? questions[questions.length - 1] : null;
    if (lastQuestion && lastQuestion.options) {
      const cleanedOptions = lastQuestion.options.map((opt: any) => ({ content: opt.content, score: opt.score }));
      questionForm.setFieldsValue({ options: cleanedOptions });
      message.info('Đã sao chép đáp án từ câu hỏi trước!');
    } else {
      message.warning('Không có câu hỏi trước đó để sao chép!');
    }
  };

  return {
    // Test states
    tests,
    loadingTests,
    isTestModalOpen,
    openTestModal,
    closeTestModal: () => setIsTestModalOpen(false),
    testForm,
    handleSaveTest,
    handleDeleteTest,
    editingTest,

    // Drawer states
    isDrawerOpen,
    openQuestionDrawer,
    closeQuestionDrawer,
    selectedTestId,

    // Question states
    questions,
    loadingQuestions,
    isQuestionModalOpen,
    openQuestionModal,
    closeQuestionModal: () => setIsQuestionModalOpen(false),
    questionForm,
    handleSaveQuestion,
    handleDeleteQuestion,
    editingQuestion,
    handleCloneOptions
  };
};
