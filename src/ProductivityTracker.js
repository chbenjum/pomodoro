import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Check, X, Target, Clock, Award, TrendingUp } from 'lucide-react';

const ProductivityTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(4);

  useEffect(() => {
    let interval;
    if (isRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime(time => time - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsRunning(false);
      if (!isBreak) {
        setCompletedPomodoros(prev => prev + 1);
        alert('¡Pomodoro completado! Toma un descanso de 5 minutos.');
        setPomodoroTime(5 * 60);
        setIsBreak(true);
      } else {
        alert('¡Descanso terminado! Listo para otro pomodoro.');
        setPomodoroTime(25 * 60);
        setIsBreak(false);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, pomodoroTime, isBreak]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask,
        completed: false,
        pomodoros: 0,
        difficulty: 'medium',
        createdAt: new Date().toLocaleDateString()
      }]);
      setNewTask('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startPomodoro = (taskId = null) => {
    setCurrentTaskId(taskId);
    setIsRunning(true);
  };

  const pausePomodoro = () => {
    setIsRunning(false);
  };

  const resetPomodoro = () => {
    setIsRunning(false);
    setPomodoroTime(isBreak ? 5 * 60 : 25 * 60);
  };

  const getMotivationalMessage = () => {
    const progress = (completedPomodoros / dailyGoal) * 100;
    if (progress >= 100) return "🎉 ¡Meta diaria alcanzada! Eres imparable";
    if (progress >= 75) return "🔥 ¡Casi lo logras! Un empujón más";
    if (progress >= 50) return "💪 ¡Vas por la mitad! Sigue así";
    if (progress >= 25) return "🚀 ¡Buen comienzo! Mantén el ritmo";
    return "✨ ¡Comienza tu primer pomodoro!";
  };

  const quickTasks = [
    "Revisar email (2 min)",
    "Organizar escritorio (5 min)",
    "Planificar mañana (10 min)",
    "Leer un artículo (15 min)"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Sistema Anti-Procrastinación</h1>
        <p className="text-gray-600">Transforma tu productividad con técnicas comprobadas</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Timer Pomodoro */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Clock className="mr-2 text-red-500" />
            Timer Pomodoro
          </h2>
          
          <div className="text-center">
            <div className={`text-6xl font-mono font-bold mb-4 ${isBreak ? 'text-green-500' : 'text-red-500'}`}>
              {formatTime(pomodoroTime)}
            </div>
            <p className="text-gray-600 mb-4">
              {isBreak ? '☕ Tiempo de descanso' : '🍅 Tiempo de trabajo'}
            </p>
            
            <div className="flex gap-2 justify-center mb-4">
              <button
                onClick={() => isRunning ? pausePomodoro() : startPomodoro()}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                  isRunning 
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isRunning ? <Pause size={16} /> : <Play size={16} />}
                {isRunning ? 'Pausar' : 'Iniciar'}
              </button>
              <button
                onClick={resetPomodoro}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Progreso Diario */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2 text-blue-500" />
            Progreso Diario
          </h2>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Pomodoros completados</span>
              <span>{completedPomodoros}/{dailyGoal}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((completedPomodoros / dailyGoal) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
            <Award className="mx-auto mb-2 text-yellow-500" size={24} />
            <p className="font-semibold text-gray-800">{getMotivationalMessage()}</p>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta diaria de pomodoros:
            </label>
            <input
              type="number"
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              min="1"
              max="12"
            />
          </div>
        </div>
      </div>

      {/* Gestión de Tareas */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Target className="mr-2 text-green-500" />
          Mis Tareas
        </h2>
        
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="¿Qué necesitas hacer hoy?"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>

        <div className="space-y-2 mb-6">
          {tasks.map(task => (
            <div key={task.id} className={`p-3 border rounded-lg flex items-center justify-between ${task.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    task.completed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {task.completed && <Check size={14} />}
                </button>
                <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                  {task.text}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {!task.completed && (
                  <button
                    onClick={() => startPomodoro(task.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    🍅 Empezar
                  </button>
                )}
                <button
                  onClick={() => removeTask(task.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Target size={48} className="mx-auto mb-2 opacity-50" />
            <p>No hay tareas aún. ¡Agrega tu primera tarea!</p>
          </div>
        )}
      </div>

      {/* Tareas Rápidas Anti-Procrastinación */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">⚡ Tareas Rápidas (Regla de 2 minutos)</h2>
        <p className="text-gray-600 mb-4">
          Si una tarea toma menos de 2 minutos, ¡hazla ahora! No la aplaces.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickTasks.map((task, index) => (
            <button
              key={index}
              onClick={() => {
                setTasks([...tasks, {
                  id: Date.now() + index,
                  text: task,
                  completed: false,
                  pomodoros: 0,
                  difficulty: 'easy',
                  createdAt: new Date().toLocaleDateString()
                }]);
              }}
              className="p-3 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg text-center"
            >
              {task}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Anti-Procrastinación */}
      <div className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-3">💡 Tips Anti-Procrastinación</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-purple-700">🧠 Técnica Pomodoro</h4>
            <p className="text-gray-600">25 min trabajo + 5 min descanso. Perfecto para mantener el foco.</p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-700">⚡ Regla 2 minutos</h4>
            <p className="text-gray-600">Si toma menos de 2 minutos, hazlo inmediatamente.</p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-700">🎯 Divide y vencerás</h4>
            <p className="text-gray-600">Tareas grandes → pasos pequeños y manejables.</p>
          </div>
          <div>
            <h4 className="font-semibold text-purple-700">🏆 Celebra logros</h4>
            <p className="text-gray-600">Reconoce cada tarea completada, por pequeña que sea.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityTracker;