import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';

type TaskStatus = 'todo' | 'inProgress' | 'completed';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
}

interface TaskFormProps {
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  initialTask?: Task;
}

function TaskForm({ onClose, onSave, initialTask }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [priority, setPriority] = useState<Task['priority']>(initialTask?.priority || 'medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title,
      description,
      status: initialTask?.status || 'todo',
      priority,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialTask ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Nome da tarefa"
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              rows={3}
              placeholder="Detalhes da tarefa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridade
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all ${
                  priority === 'low'
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Baixa
              </button>
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all ${
                  priority === 'medium'
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Média
              </button>
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all ${
                  priority === 'high'
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                Alta
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!title.trim()}
            >
              {initialTask ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
}

function TaskCard({ task, onEdit, onDelete, moveTask }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const priorityColors = {
    low: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'bg-red-100 text-red-700 border-red-200',
  };

  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
  };

  return (
    <div
      ref={drag}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-move ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-gray-900 flex-1">{task.title}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
      )}

      <div className="flex items-center gap-2">
        <span
          className={`text-xs px-2 py-1 rounded-full border ${
            priorityColors[task.priority]
          }`}
        >
          {priorityLabels[task.priority]}
        </span>
      </div>
    </div>
  );
}

interface ColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  moveTask: (id: string, newStatus: TaskStatus) => void;
  color: string;
  icon: React.ReactNode;
}

function Column({ title, status, tasks, onEdit, onDelete, moveTask, color, icon }: ColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { id: string }) => moveTask(item.id, status),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div className="flex-1 min-w-[320px]">
      <div className={`rounded-t-lg ${color} px-4 py-3 flex items-center gap-2`}>
        {icon}
        <h2 className="font-semibold text-white">{title}</h2>
        <span className="ml-auto bg-white/20 text-white text-sm px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div
        ref={drop}
        className={`bg-gray-50 rounded-b-lg p-4 min-h-[500px] transition-colors ${
          isOver ? 'bg-blue-50 ring-2 ring-blue-400' : ''
        }`}
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              moveTask={moveTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Planejar sprint',
      description: 'Definir objetivos e tarefas para a próxima sprint',
      status: 'todo',
      priority: 'high',
    },
    {
      id: '2',
      title: 'Revisar código',
      description: 'Fazer code review dos PRs pendentes',
      status: 'inProgress',
      priority: 'medium',
    },
    {
      id: '3',
      title: 'Atualizar documentação',
      description: 'Documentar as novas funcionalidades',
      status: 'completed',
      priority: 'low',
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleSaveTask = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      setTasks(tasks.map((t) => (t.id === editingTask.id ? { ...taskData, id: editingTask.id } : t)));
      setEditingTask(null);
    } else {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
      };
      setTasks([...tasks, newTask]);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const moveTask = (id: string, newStatus: TaskStatus) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const todoTasks = tasks.filter((t) => t.status === 'todo');
  const inProgressTasks = tasks.filter((t) => t.status === 'inProgress');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Quadro Kanban</h1>
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                Nova Tarefa
              </button>
            </div>
            <p className="text-gray-600">Organize suas tarefas e acompanhe o progresso</p>
          </div>

          {/* Kanban Columns */}
          <div className="flex gap-6 overflow-x-auto pb-4">
            <Column
              title="A Fazer"
              status="todo"
              tasks={todoTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              moveTask={moveTask}
              color="bg-gradient-to-r from-slate-500 to-slate-600"
              icon={
                <div className="w-5 h-5 rounded-full border-2 border-white" />
              }
            />

            <Column
              title="Em Andamento"
              status="inProgress"
              tasks={inProgressTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              moveTask={moveTask}
              color="bg-gradient-to-r from-blue-500 to-blue-600"
              icon={
                <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              }
            />

            <Column
              title="Concluído"
              status="completed"
              tasks={completedTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              moveTask={moveTask}
              color="bg-gradient-to-r from-green-500 to-green-600"
              icon={<Check size={20} />}
            />
          </div>

          {/* Task Form Modal */}
          {isFormOpen && (
            <TaskForm
              onClose={handleCloseForm}
              onSave={handleSaveTask}
              initialTask={editingTask || undefined}
            />
          )}
        </div>
      </div>
    </DndProvider>
  );
}
