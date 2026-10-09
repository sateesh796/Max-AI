import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Zap,
  Pencil,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square
} from 'lucide-react';
import { playSound } from '../utils/audio';
import { formatTime, formatDate } from '../utils/dateTime';

export default function TaskModal({
  isOpen,
  onClose,
  tasks,
  onAddTask,
  onDeleteTask,
  lastCompletedTaskTitle = null,
  onTestAutoComplete = () => {},
  onUpdateTask = () => {},
}) {
  const [filter, setFilter] = useState('all'); // all, pending, completed
  const [showAddForm, setShowAddForm] = useState(true); // Open by default for instant access
  const [currentTime, setCurrentTime] = useState(new Date());
  const [completedBannerTitle, setCompletedBannerTitle] = useState(lastCompletedTaskTitle);

  // Edit task state
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editPriority, setEditPriority] = useState('High');

  // Subtasks state: tracking open accordions and new subtask input per task
  const [expandedSubtaskIds, setExpandedSubtaskIds] = useState({});
  const [subtaskInputs, setSubtaskInputs] = useState({});

  useEffect(() => {
    if (lastCompletedTaskTitle) {
      setCompletedBannerTitle(lastCompletedTaskTitle);
    }
  }, [lastCompletedTaskTitle]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Helper for 2-digit padding
  const pad = (n) => String(n).padStart(2, '0');
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const nextHourStr = `${pad((now.getHours() + 1) % 24)}:00`;

  // New task form state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState(nextHourStr);
  const [priority, setPriority] = useState('High');

  if (!isOpen) return null;

  // Handle adding new task
  const handleAddNewTask = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      id: Date.now().toString(),
      title: title.trim(),
      date,
      time,
      priority,
      hasReminder: true,
      completed: false,
      subtasks: [],
    });

    setTitle('');
    playSound('complete');
  };

  // Start editing a task
  const handleStartEdit = (task) => {
    playSound('click');
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDate(task.date);
    setEditTime(task.time);
    setEditPriority(task.priority || 'High');
  };

  // Save edited task
  const handleSaveEdit = (e) => {
    if (e) e.preventDefault();
    if (!editTitle.trim()) return;

    const existingTask = tasks.find((t) => t.id === editingTaskId);
    onUpdateTask({
      ...(existingTask || {}),
      id: editingTaskId,
      title: editTitle.trim(),
      date: editDate,
      time: editTime,
      priority: editPriority,
      hasReminder: true,
      completed: false, // Reset so it auto-completes at the updated time
    });

    setEditingTaskId(null);
    playSound('complete');
  };

  // Subtask management inside tasks
  const toggleSubtasksView = (taskId) => {
    playSound('click');
    setExpandedSubtaskIds((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleAddSubtask = (taskId) => {
    const text = (subtaskInputs[taskId] || '').trim();
    if (!text) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const currentSubtasks = task.subtasks || [];
    const updatedSubtasks = [
      ...currentSubtasks,
      { id: Date.now().toString(), title: text, completed: false },
    ];

    onUpdateTask({
      ...task,
      subtasks: updatedSubtasks,
    });

    setSubtaskInputs((prev) => ({ ...prev, [taskId]: '' }));
    playSound('click');
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = (task.subtasks || []).map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );

    onUpdateTask({
      ...task,
      subtasks: updatedSubtasks,
    });
    playSound('click');
  };

  const handleDeleteSubtask = (taskId, subtaskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedSubtasks = (task.subtasks || []).filter((s) => s.id !== subtaskId);

    onUpdateTask({
      ...task,
      subtasks: updatedSubtasks,
    });
    playSound('click');
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl rounded-3xl glass-panel border border-cyan-500/30 p-5 sm:p-7 shadow-[0_0_50px_rgba(0,243,255,0.15)] z-10 max-h-[92vh] flex flex-col"
        >
          {/* Cyber Specular Light Bar */}
          <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-cyan-950/50 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Bell className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="font-cyber text-lg sm:text-xl font-bold tracking-wider text-slate-100 flex items-center gap-2">
                  TASK REMINDERS & SCHEDULER
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <p className="font-tech text-xs tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    {pendingCount} PENDING ASSIGNMENTS
                  </p>
                  <span className="text-cyan-500/40 hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-300">
                    <Clock className="w-3 h-3 text-cyan-400 animate-pulse" />
                    <span>{formatTime(currentTime).formatted}</span>
                    <span className="text-slate-400">({formatDate(currentTime).headerDisplay})</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click');
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Glowing Task Completion Banner */}
          <AnimatePresence>
            {completedBannerTitle && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="mt-3 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-between gap-3 shrink-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shrink-0 shadow-[0_0_12px_#10b981]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-cyber font-bold tracking-widest text-emerald-300 uppercase">
                      ASSIGNMENT COMPLETED
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-white truncate font-tech">
                      Task "{completedBannerTitle}" has been completed
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setCompletedBannerTitle(null)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-white flex items-center justify-center shrink-0"
                  title="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ADD TASK & TIME SECTION - Prominently Visible Inside */}
          <div className="mt-3 p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/35 shadow-[0_0_20px_rgba(0,243,255,0.08)] shrink-0">
            <div className="flex items-center justify-between pb-2 border-b border-cyan-500/20 mb-3">
              <span className="text-xs font-cyber font-bold text-cyan-300 uppercase flex items-center gap-1.5 tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Add New Task & Set Time
              </span>
              <button
                type="button"
                onClick={() => {
                  playSound('click');
                  setShowAddForm(!showAddForm);
                }}
                className="text-[11px] font-tech text-cyan-400 hover:text-cyan-200 uppercase tracking-wider flex items-center gap-1"
              >
                {showAddForm ? (
                  <>
                    <ChevronUp className="w-3 h-3" /> Hide Form
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3" /> Open Form
                  </>
                )}
              </button>
            </div>

            <AnimatePresence>
              {showAddForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleAddNewTask}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-[11px] font-tech uppercase tracking-wider text-slate-300 mb-1">
                      Task Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Final-Year AI Project Model Validation"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-slate-100 text-xs sm:text-sm outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-tech uppercase tracking-wider text-slate-400 mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-tech uppercase tracking-wider text-slate-400 mb-1">
                        Scheduled Time
                      </label>
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-cyan-500/50 text-cyan-300 font-mono text-xs outline-none shadow-[0_0_10px_rgba(0,243,255,0.15)]"
                      />
                      {/* Quick preset buttons for instant time setting */}
                      <div className="flex items-center gap-1 mt-1 text-[10px] font-tech">
                        <span className="text-slate-400">Quick:</span>
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date(Date.now() + 60000);
                            setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
                          }}
                          className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900"
                          title="Set time to 1 minute from now"
                        >
                          +1m (Test)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date(Date.now() + 120000);
                            setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
                          }}
                          className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900"
                        >
                          +2m
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date(Date.now() + 300000);
                            setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
                          }}
                          className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900"
                        >
                          +5m
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-tech uppercase tracking-wider text-slate-400 mb-1">
                        Priority
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs outline-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] font-tech text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" /> Auto-completes & speaks aloud at scheduled time
                    </span>

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 hover:from-cyan-300 hover:to-cyan-200 text-slate-950 font-tech font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Task to Schedule
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-3 mt-3 shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800 text-xs font-tech">
              {['all', 'pending', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    playSound('click');
                    setFilter(f);
                  }}
                  className={`px-3 py-1 rounded-lg uppercase tracking-wider transition-colors ${
                    filter === f
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <span className="text-xs font-tech text-slate-400">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
            </span>
          </div>

          {/* Tasks List */}
          <div className="mt-3 overflow-y-auto space-y-2.5 flex-1 pr-1">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-500 font-tech text-sm">
                No tasks found in this view. Use the form above to add one.
              </div>
            ) : (
              filteredTasks.map((t) => {
                const subtasks = t.subtasks || [];
                const completedSubtasksCount = subtasks.filter((s) => s.completed).length;
                const isExpanded = expandedSubtaskIds[t.id];

                return (
                  <motion.div
                    key={t.id}
                    layout
                    className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                      t.completed
                        ? 'bg-slate-950/40 border-slate-800/60 opacity-80'
                        : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/30'
                    }`}
                  >
                    {editingTaskId === t.id ? (
                      /* Inline Edit Mode Form */
                      <form onSubmit={handleSaveEdit} className="space-y-3 w-full">
                        <div className="flex items-center justify-between pb-1 border-b border-cyan-500/20">
                          <span className="text-xs font-cyber font-bold text-cyan-300 uppercase flex items-center gap-1.5">
                            <Pencil className="w-3.5 h-3.5 text-cyan-400" /> Edit Task Schedule & Time
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingTaskId(null)}
                            className="w-6 h-6 rounded-lg text-slate-400 hover:text-white flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 font-tech uppercase block mb-1">
                            Task Title
                          </label>
                          <input
                            type="text"
                            required
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-slate-100 text-xs outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="text-[10px] text-slate-400 font-tech uppercase block mb-1">
                              Due Date
                            </label>
                            <input
                              type="date"
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] text-slate-400 font-tech uppercase block mb-1">
                              Scheduled Time
                            </label>
                            <input
                              type="time"
                              value={editTime}
                              onChange={(e) => setEditTime(e.target.value)}
                              className="w-full px-2.5 py-1.5 rounded-xl bg-slate-950 border border-cyan-400/50 text-cyan-300 font-mono text-xs outline-none shadow-[0_0_10px_rgba(0,243,255,0.15)]"
                            />
                          </div>
                        </div>

                        {/* Quick presets for editing time to test auto completion */}
                        <div className="flex items-center gap-1 text-[10px] font-tech pt-0.5">
                          <span className="text-slate-400">Quick set:</span>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date(Date.now() + 60000);
                              setEditTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
                            }}
                            className="px-2 py-0.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900"
                          >
                            +1m (Test Auto-Due)
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date(Date.now() + 120000);
                              setEditTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
                            }}
                            className="px-2 py-0.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900"
                          >
                            +2m
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const d = new Date(Date.now() + 300000);
                              setEditTime(`${pad(d.getHours())}:${pad(d.getMinutes())}`);
                            }}
                            className="px-2 py-0.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900"
                          >
                            +5m
                          </button>
                        </div>

                        <div>
                          <label className="text-[10px] text-slate-400 font-tech uppercase block mb-1">
                            Priority
                          </label>
                          <select
                            value={editPriority}
                            onChange={(e) => setEditPriority(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs outline-none"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => setEditingTaskId(null)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-tech hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-tech font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                          >
                            Save Task & Schedule
                          </button>
                        </div>
                      </form>
                    ) : (
                      /* Normal View: Circle removed, status indicator + Edit button */
                      <div>
                        <div className="flex items-center justify-between gap-3 w-full">
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Status Icon Indicator (NO circle button) */}
                            {t.completed ? (
                              <div className="w-8 h-8 rounded-xl bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(0,243,255,0.2)]">
                                <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
                              </div>
                            )}

                            <div className="min-w-0">
                              <div
                                className={`text-sm font-medium truncate ${
                                  t.completed ? 'line-through text-slate-500' : 'text-slate-100'
                                }`}
                              >
                                {t.title}
                              </div>
                              {t.completed && (
                                <div className="text-[11px] font-tech text-emerald-400 font-semibold flex items-center flex-wrap gap-1.5 mt-0.5">
                                  <span className="flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                    <span>Task "{t.title}" has been completed</span>
                                  </span>
                                  {t.autoCompleted && (
                                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-emerald-950 border border-emerald-400/50 text-emerald-300 flex items-center gap-0.5">
                                      <Clock className="w-2.5 h-2.5" /> Auto-Time Due ({t.time})
                                    </span>
                                  )}
                                </div>
                              )}
                              <div className="flex items-center flex-wrap gap-2 mt-1 text-xs text-slate-400 font-tech">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3 text-cyan-400" />
                                  {t.date}
                                </span>
                                <span className="flex items-center gap-1 text-cyan-300 font-mono font-bold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                                  <Clock className="w-3 h-3 text-cyan-400" />
                                  {t.time}
                                </span>
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                                    t.priority === 'High'
                                      ? 'bg-red-950/60 text-red-400 border border-red-500/30'
                                      : t.priority === 'Medium'
                                      ? 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                                      : 'bg-slate-800 text-slate-300'
                                  }`}
                                >
                                  {t.priority}
                                </span>

                                {/* Subtasks Count Pill */}
                                <button
                                  type="button"
                                  onClick={() => toggleSubtasksView(t.id)}
                                  className="text-[11px] text-cyan-400 hover:text-cyan-200 underline font-tech flex items-center gap-0.5"
                                >
                                  {subtasks.length > 0 ? (
                                    <span>
                                      Steps ({completedSubtasksCount}/{subtasks.length})
                                    </span>
                                  ) : (
                                    <span>+ Add Steps</span>
                                  )}
                                  {isExpanded ? (
                                    <ChevronUp className="w-3 h-3" />
                                  ) : (
                                    <ChevronDown className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Right Action buttons */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Edit Task option */}
                            <button
                              onClick={() => handleStartEdit(t)}
                              className="px-2.5 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/40 text-cyan-300 hover:text-white text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-1 transition-all"
                              title="Edit Task & Scheduled Time"
                            >
                              <Pencil className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Edit</span>
                            </button>

                            {!t.completed && (
                              <button
                                onClick={() => onTestAutoComplete && onTestAutoComplete(t.id, 5)}
                                className="px-2 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-400/50 text-emerald-300 text-[10px] font-tech font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_10px_rgba(16,185,129,0.25)] transition-all"
                                title="Simulate time arrival to auto-complete this task in 5 seconds"
                              >
                                <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
                                <span className="hidden sm:inline">Auto-Alarm</span> (5s)
                              </button>
                            )}

                            <button
                              onClick={() => {
                                playSound('click');
                                onDeleteTask(t.id);
                              }}
                              className="w-8 h-8 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/40 flex items-center justify-center transition-colors shrink-0"
                              title="Delete Task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Expandable Subtasks / Checklist Inside the Task */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 overflow-hidden"
                            >
                              <div className="text-[10px] font-tech uppercase tracking-wider text-slate-400 flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-cyan-400" /> Steps & Subtasks inside this task:
                              </div>

                              {/* List of subtasks */}
                              {subtasks.length > 0 ? (
                                <div className="space-y-1.5 pl-1">
                                  {subtasks.map((st) => (
                                    <div
                                      key={st.id}
                                      className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-slate-950/50 border border-slate-800 text-xs"
                                    >
                                      <button
                                        type="button"
                                        onClick={() => handleToggleSubtask(t.id, st.id)}
                                        className="flex items-center gap-2 text-left min-w-0 flex-1 hover:text-cyan-300"
                                      >
                                        {st.completed ? (
                                          <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        ) : (
                                          <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                        )}
                                        <span
                                          className={`truncate ${
                                            st.completed ? 'line-through text-slate-500' : 'text-slate-200'
                                          }`}
                                        >
                                          {st.title}
                                        </span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteSubtask(t.id, st.id)}
                                        className="text-slate-500 hover:text-red-400 p-0.5"
                                        title="Delete step"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-[11px] text-slate-500 italic pl-1">
                                  No steps added yet. Add steps below:
                                </div>
                              )}

                              {/* Add Subtask Input Form */}
                              <div className="flex items-center gap-2 pt-1">
                                <input
                                  type="text"
                                  placeholder="Add step/subtask inside this task..."
                                  value={subtaskInputs[t.id] || ''}
                                  onChange={(e) =>
                                    setSubtaskInputs((prev) => ({ ...prev, [t.id]: e.target.value }))
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddSubtask(t.id);
                                    }
                                  }}
                                  className="flex-1 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-slate-100 text-xs outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleAddSubtask(t.id)}
                                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/50 text-cyan-300 text-xs font-tech font-bold uppercase tracking-wider flex items-center gap-1"
                                >
                                  <Plus className="w-3 h-3" /> Add
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
