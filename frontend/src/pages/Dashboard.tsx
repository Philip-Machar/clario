import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Task } from '../types';
import { fetchTasks, fetchCurrentStreak, updateTaskStatus, createTask } from '../features/tasks/taskService';
import { sendMentorMessage } from '../features/chat/chatService';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StreakMatrix from '../components/dashboard/StreakMatrix';
import ControlHub from '../components/dashboard/ControlHub';
import TaskBoard, { BoardColumnKey } from '../components/dashboard/TaskBoard';
import MentorChat, { MentorMessage } from '../components/dashboard/MentorChat';

const Dashboard = () => {
  const { logout, user } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [streak, setStreak] = useState<number | null>(null);
  const [isLoadingStreak, setIsLoadingStreak] = useState(true);

  const [mentorMessages, setMentorMessages] = useState<MentorMessage[]>([]);
  const [mentorInput, setMentorInput] = useState('');
  const [isSendingMentor, setIsSendingMentor] = useState(false);

  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Initial load
  useEffect(() => {
    const load = async () => {
      try {
        const [tasksData, streakValue] = await Promise.all([
          fetchTasks(),
          fetchCurrentStreak(),
        ]);
        setTasks(Array.isArray(tasksData) ? tasksData : []);
        setStreak(typeof streakValue === 'number' ? streakValue : null);
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setIsLoadingTasks(false);
        setIsLoadingStreak(false);
      }
    };
    load();
  }, []);

  const handleStatusChange = async (task: Task, status: BoardColumnKey) => {
    try {
      setTasks(prev =>
        prev.map(t => (t.id === task.id ? { ...t, status } : t)),
      );
      await updateTaskStatus(task.id, status);
    } catch (error) {
      console.error('Failed to update status', error);
      // Ideally refetch tasks if this fails
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return;
    try {
      setIsCreatingTask(true);
      const created = await createTask({
        title: newTaskTitle.trim(),
        description: newTaskDescription.trim(),
        priority: newTaskPriority,
      });
      setTasks(prev => [created, ...prev]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
    } catch (error) {
      console.error('Failed to create task', error);
    } finally {
      setIsCreatingTask(false);
    }
  };

  const handleSendMentor = async () => {
    const trimmed = mentorInput.trim();
    if (!trimmed) return;

    const userMsg: MentorMessage = {
      id: `user-${Date.now()}`,
      from: 'user',
      text: trimmed,
    };

    setMentorMessages(prev => [...prev, userMsg]);
    setMentorInput('');
    setIsSendingMentor(true);

    try {
      const res = await sendMentorMessage(trimmed);
      const mentorMsg: MentorMessage = {
        id: `mentor-${Date.now()}`,
        from: 'mentor',
        text: res.response,
      };
      setMentorMessages(prev => [...prev, mentorMsg]);
    } catch (error) {
      console.error('Failed to send mentor message', error);
    } finally {
      setIsSendingMentor(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050712] text-slate-50 flex flex-col">
      <DashboardHeader user={user} onLogout={logout} />
      <StreakMatrix streak={streak} isLoading={isLoadingStreak} />

      {/* Main grid */}
      <main className="flex-1 px-10 pb-8 grid grid-cols-[minmax(260px,280px)_minmax(0,1.6fr)_minmax(260px,320px)] gap-6">
        <ControlHub tasks={tasks} />

        <TaskBoard
          tasks={tasks}
          isLoading={isLoadingTasks}
          onCreateTask={handleCreateTask}
          isCreating={isCreatingTask}
          newTaskTitle={newTaskTitle}
          newTaskDescription={newTaskDescription}
          newTaskPriority={newTaskPriority}
          setNewTaskTitle={setNewTaskTitle}
          setNewTaskDescription={setNewTaskDescription}
          setNewTaskPriority={setNewTaskPriority}
          onStatusChange={handleStatusChange}
        />

        <MentorChat
          messages={mentorMessages}
          input={mentorInput}
          setInput={setMentorInput}
          onSend={handleSendMentor}
          isSending={isSendingMentor}
        />
      </main>
    </div>
  );
};

export default Dashboard;
