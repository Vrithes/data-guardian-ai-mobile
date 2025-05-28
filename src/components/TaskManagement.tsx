import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, Calendar, User, Phone, Settings } from 'lucide-react';
import TaskDetail from './TaskDetail';
import AIProcessingDetail from './AIProcessingDetail';

interface Task {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  progress: number;
  assignee: string;
  deadline: string;
  autoProcessable: boolean;
  aiResult?: any;
  confirmationData?: any;
}

const TaskManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [aiProcessingTask, setAiProcessingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: '手机号异常检测',
      description: '检测并处理1,247个异常手机号',
      category: 'phone',
      priority: 'high',
      status: 'in-progress',
      progress: 75,
      assignee: '网格员001',
      deadline: '2024-01-15',
      autoProcessable: true
    },
    {
      id: 2,
      title: '地址信息补全',
      description: '补全2,156条不完整地址信息',
      category: 'address',
      priority: 'medium',
      status: 'completed',
      progress: 100,
      assignee: 'AI智能体',
      deadline: '2024-01-14',
      autoProcessable: true
    },
    {
      id: 3,
      title: '合同信息校验',
      description: '校验867个合同信息一致性',
      category: 'contract',
      priority: 'high',
      status: 'pending',
      progress: 0,
      assignee: '网格员005',
      deadline: '2024-01-16',
      autoProcessable: false
    },
    {
      id: 4,
      title: '证照有效期检查',
      description: '检查134个证照有效期状态',
      category: 'certificate',
      priority: 'low',
      status: 'in-progress',
      progress: 60,
      assignee: 'AI智能体',
      deadline: '2024-01-17',
      autoProcessable: true
    },
    {
      id: 5,
      title: '外呼验证任务',
      description: '验证3,421个手机号有效性',
      category: 'call',
      priority: 'medium',
      status: 'in-progress',
      progress: 45,
      assignee: 'AI外呼系统',
      deadline: '2024-01-15',
      autoProcessable: true
    }
  ]);

  const categories = [
    { key: 'all', label: '全部', count: tasks.length },
    { key: 'phone', label: '手机号', count: tasks.filter(t => t.category === 'phone').length },
    { key: 'address', label: '地址', count: tasks.filter(t => t.category === 'address').length },
    { key: 'contract', label: '合同', count: tasks.filter(t => t.category === 'contract').length },
    { key: 'certificate', label: '证照', count: tasks.filter(t => t.category === 'certificate').length },
    { key: 'call', label: '外呼', count: tasks.filter(t => t.category === 'call').length }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      'pending': { label: '待处理', variant: 'secondary' },
      'in-progress': { label: '进行中', variant: 'default' },
      'completed': { label: '已完成', variant: 'default', className: 'bg-green-500' }
    };
    return statusMap[status] || statusMap.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      'high': { label: '高', className: 'bg-red-500 text-white' },
      'medium': { label: '中', className: 'bg-yellow-500 text-white' },
      'low': { label: '低', className: 'bg-gray-500 text-white' }
    };
    return priorityMap[priority] || priorityMap.medium;
  };

  const filteredTasks = selectedCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === selectedCategory);

  const overallProgress = Math.round(
    tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length
  );

  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;

  const handleTaskConfirm = (taskId: number, result: any) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: result.status === 'resolved' ? 'completed' : task.status,
              progress: result.status === 'resolved' ? 100 : task.progress,
              confirmationData: result
            }
          : task
      )
    );
    console.log('任务确认结果:', result);
  };

  const handleAIProcess = (task: Task) => {
    console.log('启动AI处理:', task);
    setAiProcessingTask(task);
  };

  const handleAIComplete = (result: any) => {
    console.log('AI处理完成:', result);
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === aiProcessingTask?.id 
          ? { 
              ...task, 
              status: 'completed',
              progress: 100,
              assignee: 'AI智能体',
              aiResult: result
            }
          : task
      )
    );
    setAiProcessingTask(null);
  };

  // If AI processing is active, show the AI processing detail
  if (aiProcessingTask) {
    return (
      <AIProcessingDetail 
        taskId={aiProcessingTask.id}
        taskType={aiProcessingTask.category}
        onComplete={handleAIComplete}
        onCancel={() => setAiProcessingTask(null)}
      />
    );
  }

  // If a task is selected, show the detail view
  if (selectedTask) {
    return (
      <TaskDetail 
        task={selectedTask}
        onBack={() => setSelectedTask(null)}
        onConfirm={handleTaskConfirm}
      />
    );
  }

  return (
    <div className="p-4 pb-20 bg-gray-50 min-h-screen">
      {/* 总体进度概览 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            任务总体进度
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">整体完成度</span>
              <span className="text-lg font-bold text-blue-600">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{completedTasks}</div>
                <div className="text-sm text-gray-600">已完成</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{inProgressTasks}</div>
                <div className="text-sm text-gray-600">进行中</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-xl font-bold text-gray-600">{pendingTasks}</div>
                <div className="text-sm text-gray-600">待处理</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI智能分配 */}
      <Card className="mb-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">🤖 AI智能任务分配</h3>
              <p className="text-purple-100 text-sm">基于工作负载和技能匹配自动分配</p>
            </div>
            <Button variant="secondary" size="sm">
              重新分配
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 任务分类筛选 */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.key)}
              className="relative"
            >
              {category.label}
              <Badge variant="secondary" className="ml-1 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* 任务列表 */}
      <div className="space-y-4">
        {filteredTasks.map((task) => {
          const statusBadge = getStatusBadge(task.status);
          const priorityBadge = getPriorityBadge(task.priority);
          
          return (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      {task.autoProcessable && (
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600">
                          🤖 AI可处理
                        </Badge>
                      )}
                      {task.aiResult && (
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600">
                          ✨ AI已处理
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge {...statusBadge} className={statusBadge.className}>
                      {statusBadge.label}
                    </Badge>
                    <Badge className={priorityBadge.className}>
                      {priorityBadge.label}优先级
                    </Badge>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">进度</span>
                    <span className="text-sm font-medium">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>

                {/* AI处理结果预览 */}
                {task.aiResult && (
                  <div className="mb-3 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-purple-100 text-purple-700 text-xs">
                        AI处理结果
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <div className="font-semibold">{task.aiResult.auto_resolved || task.aiResult.auto_completed || task.aiResult.auto_verified || 0}</div>
                        <div className="text-gray-600">自动处理</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{task.aiResult.accuracy || task.aiResult.completion_rate || 0}%</div>
                        <div className="text-gray-600">准确率</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{task.aiResult.processing_time || '未知'}</div>
                        <div className="text-gray-600">处理时间</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 任务详情 */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{task.assignee}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{task.deadline}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {task.status !== 'completed' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedTask(task)}
                        >
                          网格员处理
                        </Button>
                        {task.autoProcessable && (
                          <Button 
                            size="sm" 
                            className="bg-purple-500 hover:bg-purple-600"
                            onClick={() => handleAIProcess(task)}
                          >
                            AI智能处理
                          </Button>
                        )}
                      </>
                    )}
                    {task.status === 'completed' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedTask(task)}
                      >
                        查看详情
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 快捷操作 */}
      <div className="fixed bottom-20 right-4">
        <Button className="rounded-full w-14 h-14 shadow-lg bg-blue-500 hover:bg-blue-600">
          <span className="text-2xl">+</span>
        </Button>
      </div>
    </div>
  );
};

export default TaskManagement;
