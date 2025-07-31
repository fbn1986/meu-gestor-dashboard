import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { 
    Search, Loader, AlertCircle, TrendingUp, TrendingDown, DollarSign, Wallet, 
    LayoutDashboard, List, ChevronDown, ChevronUp, Database, Edit, Trash2, X, 
    PlusCircle, Tag, Calendar, LogOut, MoreVertical, ArrowLeft, ArrowRight,
    ClipboardList, Clock, Briefcase, Coffee
} from 'lucide-react';
// Importando a biblioteca Luxon que foi instalada localmente via npm.
import { DateTime, Duration } from "luxon";


// Cores para o gráfico e cards
const COLORS = ['#3b82f6', '#10b981', '#f97316', '#ef4444', '#8b5cf6', '#ec4899', '#f59e0b'];

// --- Componentes da UI ---

const Header = ({ onFetch, loading, phoneNumber, setPhoneNumber, activeView, setActiveView, handleLogout, isLoggedIn }) => (
  <header className="bg-white shadow-sm sticky top-0 z-20">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-4 flex flex-wrap justify-between items-center gap-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Wallet className="text-blue-600" size={28} />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Meu Gestor</h1>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Seu nº WhatsApp (só números)"
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition w-40 sm:w-48"
            onKeyPress={(e) => e.key === 'Enter' && onFetch()}
            disabled={isLoggedIn}
          />
          <button
            onClick={() => onFetch()}
            disabled={loading || isLoggedIn}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center disabled:bg-gray-400"
          >
            {loading ? <Loader className="animate-spin sm:mr-2" size={20}/> : <Search size={20} className="sm:mr-2"/>}
            <span className="hidden sm:inline">Carregar</span>
          </button>
          {isLoggedIn && (
             <button
                onClick={handleLogout}
                title="Sair"
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition flex items-center"
             >
               <LogOut size={20} />
             </button>
          )}
        </div>
      </div>
      {isLoggedIn && (
        <nav className="flex space-x-4 sm:space-x-8 -mb-px overflow-x-auto">
            <button 
            onClick={() => setActiveView('visaoGeral')}
            className={`py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap ${activeView === 'visaoGeral' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
            <LayoutDashboard size={16} /> Visão Geral
            </button>
            <button 
            onClick={() => setActiveView('ponto')}
            className={`py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap ${activeView === 'ponto' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
            <Clock size={16} /> Registro de Ponto
            </button>
            <button 
            onClick={() => setActiveView('planejamento')}
            className={`py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap ${activeView === 'planejamento' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
            <ClipboardList size={16} /> Planejamento
            </button>
            <button 
            onClick={() => setActiveView('categorias')}
            className={`py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap ${activeView === 'categorias' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
            <List size={16} /> Despesas por Categoria
            </button>
            <button 
            onClick={() => setActiveView('tabela')}
            className={`py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap ${activeView === 'tabela' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
            <Database size={16} /> Todas as Transações
            </button>
            <button 
            onClick={() => setActiveView('gerenciarCategorias')}
            className={`py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap ${activeView === 'gerenciarCategorias' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
            <Tag size={16} /> Minhas Categorias
            </button>
            <button 
            onClick={() => setActiveView('agenda')}
            className={`py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 whitespace-nowrap ${activeView === 'agenda' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
            <Calendar size={16} /> Agenda
            </button>
        </nav>
      )}
    </div>
  </header>
);

const StatCard = ({ title, value, icon, colorClass, subValue }) => (
    <div className="bg-white p-4 rounded-lg shadow flex-1">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg mr-4 ${colorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
          {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
        </div>
      </div>
    </div>
);

const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;
    return (
      <g>
        <text x={cx} y={cy - 5} dy={8} textAnchor="middle" fill="#333" className="font-bold text-2xl">
          R$ {payload.value.toFixed(2).replace('.', ',')}
        </text>
        <text x={cx} y={cy + 20} dy={8} textAnchor="middle" fill="#999" className="text-sm">
          Total Pago
        </text>
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} stroke="#fff" />
      </g>
    );
};

const CategoryDetails = ({ data, total }) => (
    <div className="w-full space-y-3">
        {data.map((entry, index) => {
            const percentage = total > 0 ? (entry.value / total * 100).toFixed(1) : 0;
            return (
                <div key={`item-${index}`} className="flex items-center justify-between text-sm hover:bg-gray-50 p-1 rounded">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-gray-700">{entry.name}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold text-gray-800 mr-2">R$ {entry.value.toFixed(2).replace('.', ',')}</span>
                        <span className="text-gray-500 text-xs w-12 text-right">{percentage}%</span>
                    </div>
                </div>
            )
        })}
    </div>
);

const VisaoGeralView = ({ stats }) => (
    <div className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <StatCard title="Receitas" value={`R$ ${stats.totalIncome.toFixed(2).replace('.', ',')}`} icon={<TrendingUp size={24} className="text-green-600"/>} colorClass="bg-green-100"/>
            <StatCard title="Despesas" value={`R$ ${stats.totalExpense.toFixed(2).replace('.', ',')}`} icon={<TrendingDown size={24} className="text-red-600"/>} colorClass="bg-red-100"/>
            <StatCard title="Balanço" value={`R$ ${stats.balance.toFixed(2).replace('.', ',')}`} icon={<DollarSign size={24} className="text-blue-600"/>} colorClass="bg-blue-100"/>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Despesas por Categoria</h3>
            <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/2 lg:w-2/5">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={stats.expenseByCategory} cx="50%" cy="50%" innerRadius={70} outerRadius={100} fill="#8884d8" paddingAngle={2} dataKey="value" activeShape={renderActiveShape} activeIndex={0}>
                                {stats.expenseByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 lg:w-3/5">
                    <CategoryDetails data={stats.expenseByCategory} total={stats.totalExpense} />
                </div>
            </div>
        </div>
    </div>
);

// NOVO COMPONENTE PARA A TELA DE PONTO
const PontoView = ({ timeLogs }) => {
    const timeZone = 'America/Sao_Paulo';

    const stats = useMemo(() => {
        let totalToday = Duration.fromMillis(0);
        let totalWeek = Duration.fromMillis(0);
        let totalMonth = Duration.fromMillis(0);

        const now = DateTime.now().setZone(timeZone);
        
        timeLogs.forEach(log => {
            const clockIn = DateTime.fromISO(log.clock_in).setZone(timeZone);
            if (!log.clock_out) return;
            const clockOut = DateTime.fromISO(log.clock_out).setZone(timeZone);
            const duration = clockOut.diff(clockIn);

            if (clockIn.hasSame(now, 'day')) {
                totalToday = totalToday.plus(duration);
            }
            if (clockIn.hasSame(now, 'week')) {
                totalWeek = totalWeek.plus(duration);
            }
            if (clockIn.hasSame(now, 'month')) {
                totalMonth = totalMonth.plus(duration);
            }
        });

        return {
            today: totalToday.toFormat("hh'h' mm'min'"),
            week: totalWeek.toFormat("hh'h' mm'min'"),
            month: totalMonth.toFormat("hh'h' mm'min'")
        };
    }, [timeLogs]);

    const latestLog = timeLogs?.[0];
    const isWorking = latestLog && !latestLog.clock_out;

    return (
        <div className="space-y-8">
            <div className={`p-6 rounded-lg shadow-md ${isWorking ? 'bg-blue-50' : 'bg-green-50'}`}>
                <div className="flex items-center">
                    {isWorking ? <Briefcase className="text-blue-600 mr-4" size={32}/> : <Coffee className="text-green-600 mr-4" size={32}/>}
                    <div>
                        <p className="text-lg font-semibold">{isWorking ? "Você está trabalhando" : "Fora de expediente"}</p>
                        <p className="text-sm text-gray-600">
                            {isWorking 
                                ? `Entrada registrada às ${DateTime.fromISO(latestLog.clock_in).setZone(timeZone).toFormat('HH:mm')}`
                                : "Bata o ponto pelo WhatsApp para iniciar um novo registro."
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <StatCard title="Horas Hoje" value={stats.today} icon={<Clock size={24} className="text-indigo-600"/>} colorClass="bg-indigo-100"/>
                <StatCard title="Horas na Semana" value={stats.week} icon={<Clock size={24} className="text-yellow-600"/>} colorClass="bg-yellow-100"/>
                <StatCard title="Horas no Mês" value={stats.month} icon={<Clock size={24} className="text-pink-600"/>} colorClass="bg-pink-100"/>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Registros de Ponto</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Data</th>
                                <th scope="col" className="px-6 py-3">Entrada</th>
                                <th scope="col" className="px-6 py-3">Saída</th>
                                <th scope="col" className="px-6 py-3">Duração</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeLogs.map(log => {
                                const clockIn = DateTime.fromISO(log.clock_in).setZone(timeZone);
                                const clockOut = log.clock_out ? DateTime.fromISO(log.clock_out).setZone(timeZone) : null;
                                const duration = clockOut ? clockOut.diff(clockIn, ['hours', 'minutes']).toObject() : null;
                                return (
                                    <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{clockIn.toFormat('dd/MM/yyyy')}</td>
                                        <td className="px-6 py-4 text-green-600 font-semibold">{clockIn.toFormat('HH:mm')}</td>
                                        <td className="px-6 py-4 text-red-600 font-semibold">{clockOut ? clockOut.toFormat('HH:mm') : '...'}</td>
                                        <td className="px-6 py-4">{duration ? `${Math.floor(duration.hours)}h ${Math.floor(duration.minutes)}min` : '-'}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                {timeLogs.length === 0 && <p className="text-center text-gray-500 mt-6">Nenhum registro de ponto encontrado.</p>}
            </div>
        </div>
    );
};


const CategoriasView = ({ expensesGrouped }) => {
    const [expandedCategory, setExpandedCategory] = useState(null);

    const toggleCategory = (categoryName) => {
        setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(expensesGrouped).map(([category, data], index) => {
                const categoryTotal = data.reduce((sum, item) => sum + item.value, 0);
                const isExpanded = expandedCategory === category;
                return (
                    <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                        <button onClick={() => toggleCategory(category)} className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 border-l-4" style={{ borderColor: COLORS[index % COLORS.length] }}>
                           <div>
                             <h3 className="font-bold text-lg text-gray-800">{category}</h3>
                             <p className="text-2xl font-bold text-gray-900 mt-1">R$ {categoryTotal.toFixed(2).replace('.', ',')}</p>
                           </div>
                           {isExpanded ? <ChevronUp size={20} className="text-gray-500"/> : <ChevronDown size={20} className="text-gray-500"/>}
                        </button>
                        {isExpanded && (
                            <div className="border-t p-4">
                                <ul className="space-y-2">
                                    {data.map(expense => (
                                        <li key={expense.id} className="flex justify-between text-sm text-gray-600 border-b pb-1">
                                            <span className="truncate pr-2">{expense.description}</span>
                                            <span className="font-medium whitespace-nowrap">R$ {expense.value.toFixed(2).replace('.', ',')}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    );
};

const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <X size={24} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const TabelaTransacoesView = ({ transactions, setTransactions, phoneNumber, categories, setCategories }) => {
  const [filterText, setFilterText] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  
  const API_BASE_URL = 'https://meu-gestor-fernando.onrender.com';

  const filteredTransactions = useMemo(() => {
      return transactions.filter(t => {
          const transactionDate = new Date(t.date);
          const start = startDate ? new Date(startDate) : null;
          const end = endDate ? new Date(endDate) : null;

          if (start && transactionDate < start) return false;
          if (end) {
              const endOfDay = new Date(end);
              endOfDay.setHours(23, 59, 59, 999);
              if (transactionDate > endOfDay) return false;
          }
          if (filterCategory !== 'all' && (t.category || 'Outros') !== filterCategory) return false;
          if (filterText && !t.description.toLowerCase().includes(filterText.toLowerCase())) return false;
          
          return true;
      });
  }, [transactions, filterCategory, filterText, startDate, endDate]);

  const handleEdit = (transaction) => {
      setModalError(null);
      setSelectedTransaction(transaction);
      setShowNewCategoryInput(false);
      setIsEditModalOpen(true);
  };

  const handleDelete = (transaction) => {
      setModalError(null);
      setSelectedTransaction(transaction);
      setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
      if (!selectedTransaction) return;
      setModalError(null);
      const { id, type } = selectedTransaction;
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      const endpoint = type === 'expense' 
          ? `/api/expense/${id}?phone_number=${cleanPhoneNumber}` 
          : `/api/income/${id}?phone_number=${cleanPhoneNumber}`;
      
      try {
          const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'DELETE' });
          if (!response.ok) {
              const errData = await response.json();
              throw new Error(errData.detail || 'Falha ao apagar.');
          }
          
          setTransactions(prev => prev.filter(t => !(t.id === id && t.type === type)));
          setIsDeleteModalOpen(false);
          setSelectedTransaction(null);
      } catch (err) {
          setModalError(err.message);
      }
  };

  const handleUpdate = async (e) => {
      e.preventDefault();
      if (!selectedTransaction) return;
      setModalError(null);

      const { id, type } = selectedTransaction;
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      const form = e.target;

      let finalCategory = form.elements.category.value;
      if (showNewCategoryInput && form.elements.newCategory.value) {
          const newCategoryName = form.elements.newCategory.value;
          try {
              const response = await fetch(`${API_BASE_URL}/api/categories/${cleanPhoneNumber}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: newCategoryName }),
              });
              if (!response.ok) throw new Error('Falha ao criar nova categoria.');
              const newCategory = await response.json();
              setCategories(prev => [...prev, newCategory]);
              finalCategory = newCategory.name;
          } catch (err) {
              setModalError(err.message);
              return;
          }
      }

      const endpoint = type === 'expense' 
          ? `/api/expense/${id}?phone_number=${cleanPhoneNumber}` 
          : `/api/income/${id}?phone_number=${cleanPhoneNumber}`;
      
      const updatedData = {
          description: form.elements.description.value,
          value: parseFloat(form.elements.value.value),
          ...(type === 'expense' && { category: finalCategory })
      };

      try {
          const response = await fetch(`${API_BASE_URL}${endpoint}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedData),
          });
          if (!response.ok) {
              const errData = await response.json();
              throw new Error(errData.detail || 'Falha ao atualizar.');
          }
          const result = await response.json();
          
          setTransactions(prev => prev.map(t => 
              (t.id === id && t.type === type) 
              ? { ...t, 
                  description: result.description, 
                  value: parseFloat(result.value), 
                  category: result.category,
                  date: result.transaction_date || t.date 
                } 
              : t
          ));
          setIsEditModalOpen(false);
          setSelectedTransaction(null);
      } catch (err) {
          setModalError(err.message);
      }
  };

  return (
      <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Todas as Transações</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border rounded-md" />
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border rounded-md" />
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="p-2 border rounded-md">
                  <option value="all">Todas as Categorias</option>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
              </select>
              <input type="text" value={filterText} onChange={e => setFilterText(e.target.value)} placeholder="Pesquisar descrição..." className="p-2 border rounded-md" />
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                          <th scope="col" className="px-6 py-3">Data</th>
                          <th scope="col" className="px-6 py-3">Descrição</th>
                          <th scope="col" className="px-6 py-3">Categoria</th>
                          <th scope="col" className="px-6 py-3">Valor</th>
                          <th scope="col" className="px-6 py-3">Ações</th>
                      </tr>
                  </thead>
                  <tbody>
                      {filteredTransactions.map(t => (
                          <tr key={`${t.type}-${t.id}`} className={`border-b ${t.type === 'income' ? 'bg-green-50' : 'bg-red-50'}`}>
                              <td className="px-6 py-4">{new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</td>
                              <td className="px-6 py-4 font-medium text-gray-900">{t.description}</td>
                              <td className="px-6 py-4">{t.category || 'N/A'}</td>
                              <td className={`px-6 py-4 font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                                  {t.type === 'income' ? '+' : '-'} R$ {t.value.toFixed(2).replace('.',',')}
                              </td>
                              <td className="px-6 py-4 flex items-center gap-3">
                                  <button onClick={() => handleEdit(t)} className="text-blue-600 hover:text-blue-800"><Edit size={16} /></button>
                                  <button onClick={() => handleDelete(t)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          {filteredTransactions.length === 0 && <p className="text-center text-gray-500 mt-6">Nenhuma transação encontrada para os filtros selecionados.</p>}

          <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Transação">
              {selectedTransaction && (
                  <form onSubmit={handleUpdate}>
                      {modalError && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{modalError}</div>}
                      <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                          <input type="text" name="description" defaultValue={selectedTransaction.description} className="p-2 border rounded-md w-full" required />
                      </div>
                      <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Valor</label>
                          <input type="number" step="0.01" name="value" defaultValue={selectedTransaction.value} className="p-2 border rounded-md w-full" required />
                      </div>
                      {selectedTransaction.type === 'expense' && (
                          <div className="mb-6">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                              <select 
                                  name="category" 
                                  defaultValue={selectedTransaction.category || 'Outros'}
                                  onChange={(e) => setShowNewCategoryInput(e.target.value === 'new')}
                                  className="p-2 border rounded-md w-full"
                              >
                                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                                  <option value="new">-- Criar Nova Categoria --</option>
                              </select>
                              {showNewCategoryInput && (
                                  <input 
                                      type="text" 
                                      name="newCategory" 
                                      placeholder="Nome da nova categoria"
                                      className="p-2 border rounded-md w-full mt-2"
                                  />
                              )}
                          </div>
                      )}
                      <div className="flex justify-end gap-3 mt-6">
                          <button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Salvar</button>
                      </div>
                  </form>
              )}
          </Modal>

          <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Exclusão">
              {selectedTransaction && (
                  <div>
                      {modalError && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{modalError}</div>}
                      <p className="text-gray-700 mb-6">Tem a certeza que deseja apagar a transação: "{selectedTransaction.description}"?</p>
                      <div className="flex justify-end gap-3">
                          <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                          <button type="button" onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Apagar</button>
                      </div>
                  </div>
              )}
          </Modal>
      </div>
  );
};

const GerenciarCategoriasView = ({ categories, setCategories, phoneNumber }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  
  const API_BASE_URL = 'https://meu-gestor-fernando.onrender.com';

  const openModal = (mode, category = null) => {
      setModalMode(mode);
      setSelectedCategory(category);
      setCategoryName(category ? category.name : '');
      setError('');
      setIsModalOpen(true);
  };

  const handleSave = async (e) => {
      e.preventDefault();
      if (!categoryName) {
          setError('O nome da categoria não pode estar vazio.');
          return;
      }
      setError('');
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');

      if (modalMode === 'create') {
          try {
              const response = await fetch(`${API_BASE_URL}/api/categories/${cleanPhoneNumber}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: categoryName }),
              });
              if (!response.ok) throw new Error('Falha ao criar categoria.');
              const newCategory = await response.json();
              setCategories(prev => [...prev, newCategory].sort((a, b) => a.name.localeCompare(b.name)));
              setIsModalOpen(false);
          } catch (err) {
              setError(err.message);
          }
      } else {
          try {
              const response = await fetch(`${API_BASE_URL}/api/category/${selectedCategory.id}?phone_number=${cleanPhoneNumber}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ name: categoryName }),
              });
              if (!response.ok) throw new Error('Falha ao editar categoria.');
              const updatedCategory = await response.json();
              setCategories(prev => prev.map(c => c.id === updatedCategory.id ? updatedCategory : c));
              setIsModalOpen(false);
          } catch (err) {
              setError(err.message);
          }
      }
  };
  
  const handleDelete = async (category) => {
      if (window.confirm(`Tem a certeza que quer apagar a categoria "${category.name}"?`)) {
          const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
          try {
              const response = await fetch(`${API_BASE_URL}/api/category/${category.id}?phone_number=${cleanPhoneNumber}`, {
                  method: 'DELETE',
              });
              if (!response.ok) throw new Error('Falha ao apagar categoria.');
              setCategories(prev => prev.filter(c => c.id !== category.id));
          } catch (err) {
              alert(err.message);
          }
      }
  };

  return (
      <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Gerenciar Categorias Personalizadas</h2>
          <p className="text-sm text-gray-600 mb-6">A IA é capaz de identificar categorias automaticamente. No entanto, se preferir, você pode personalizar as categorias de acordo com suas necessidades.</p>
          
          <div className="mb-6">
              <button onClick={() => openModal('create')} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center">
                  <PlusCircle size={18} className="mr-2"/>
                  Crie sua categoria
              </button>
          </div>

          <div className="space-y-3">
              {categories.map((cat, index) => (
                  <div key={cat.id} className="flex justify-between items-center p-3 rounded-md" style={{ backgroundColor: index % 2 === 0 ? '#f9fafb' : '#fff' }}>
                      <div className="flex items-center">
                          <span className="w-3 h-3 rounded-full mr-4" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                          <span className="text-gray-800 font-medium">{cat.name}</span>
                          {cat.is_default && <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full ml-3">Padrão</span>}
                      </div>
                      {!cat.is_default && (
                          <div className="flex items-center gap-4">
                              <button onClick={() => openModal('edit', cat)} className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                  <Edit size={14}/> Editar
                              </button>
                              <button onClick={() => handleDelete(cat)} className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1">
                                  <Trash2 size={14}/> Excluir
                              </button>
                          </div>
                      )}
                  </div>
              ))}
          </div>

          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalMode === 'create' ? 'Criar Nova Categoria' : 'Editar Categoria'}>
              <form onSubmit={handleSave}>
                  {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</div>}
                  <div className="mb-4">
                      <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria</label>
                      <input 
                          type="text" 
                          id="categoryName"
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          className="p-2 border rounded-md w-full" 
                          required 
                      />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                      <button type="button" onClick={() => setIsModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Salvar</button>
                  </div>
              </form>
          </Modal>
      </div>
  );
};

const AgendaView = ({ reminders, setReminders, phoneNumber }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [modalError, setModalError] = useState(null);
  
  const API_BASE_URL = 'https://meu-gestor-fernando.onrender.com';

  const formatToLocalDateTime = (isoString) => {
    if (!isoString) return '';
    // Luxon: Cria um objeto DateTime a partir da string ISO (que está em UTC)
    // e o converte para o fuso de São Paulo.
    return DateTime.fromISO(isoString)
      .setZone('America/Sao_Paulo')
      .toFormat("yyyy-MM-dd'T'HH:mm");
  };

  const handleEdit = (reminder) => {
      setModalError(null);
      setSelectedReminder(reminder);
      setIsEditModalOpen(true);
  };

  const handleDelete = (reminder) => {
      setModalError(null);
      setSelectedReminder(reminder);
      setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
      if (!selectedReminder) return;
      setModalError(null);
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      
      try {
          const response = await fetch(`${API_BASE_URL}/api/reminder/${selectedReminder.id}?phone_number=${cleanPhoneNumber}`, {
              method: 'DELETE',
          });
          if (!response.ok) {
              const errData = await response.json();
              throw new Error(errData.detail || 'Falha ao apagar o lembrete.');
          }
          
          setReminders(prev => prev.filter(r => r.id !== selectedReminder.id));
          setIsDeleteModalOpen(false);
          setSelectedReminder(null);
      } catch (err) {
          setModalError(err.message);
      }
  };
  
  const handleUpdate = async (e) => {
      e.preventDefault();
      if (!selectedReminder) return;
      setModalError(null);
      
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
      const form = e.target;
      
      const localDateTimeString = form.elements.due_date.value;
      
      // Luxon: Cria um objeto DateTime a partir da string do input,
      // especificando que essa string representa o horário de São Paulo.
      const localDateTime = DateTime.fromISO(localDateTimeString, { zone: 'America/Sao_Paulo' });

      // Converte o objeto para UTC e depois para uma string ISO.
      const utcDateTimeString = localDateTime.toUTC().toISO();

      const updatedData = {
          description: form.elements.description.value,
          due_date: utcDateTimeString,
      };

      try {
          const response = await fetch(`${API_BASE_URL}/api/reminder/${selectedReminder.id}?phone_number=${cleanPhoneNumber}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedData),
          });
          if (!response.ok) {
              const errData = await response.json();
              throw new Error(errData.detail || 'Falha ao atualizar o lembrete.');
          }
          const result = await response.json();
          
          setReminders(prev => prev.map(r => (r.id === result.id ? result : r)));
          setIsEditModalOpen(false);
          setSelectedReminder(null);
      } catch (err) {
          setModalError(err.message);
      }
  };

  return (
      <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Agenda de Lembretes</h2>
          <div className="space-y-4">
              {reminders.length > 0 ? (
                  reminders.map(reminder => (
                      <div key={reminder.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                              <p className="font-semibold text-gray-800">{reminder.description}</p>
                              <p className="text-sm text-gray-500">
                                  {DateTime.fromISO(reminder.due_date).setZone('America/Sao_Paulo').toLocaleString(DateTime.DATETIME_FULL)}
                              </p>
                          </div>
                          <div className="flex items-center gap-4">
                              <button onClick={() => handleEdit(reminder)} className="text-sm text-blue-600 hover:text-blue-800"><Edit size={16}/></button>
                              <button onClick={() => handleDelete(reminder)} className="text-sm text-red-600 hover:text-red-800"><Trash2 size={16}/></button>
                          </div>
                      </div>
                  ))
              ) : (
                  <p className="text-center text-gray-500">Nenhum lembrete agendado.</p>
              )}
          </div>

          <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Lembrete">
              {selectedReminder && (
                  <form onSubmit={handleUpdate}>
                      {modalError && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{modalError}</div>}
                      <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                          <input type="text" name="description" defaultValue={selectedReminder.description} className="p-2 border rounded-md w-full" required />
                      </div>
                      <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Data e Hora</label>
                          <input type="datetime-local" name="due_date" defaultValue={formatToLocalDateTime(selectedReminder.due_date)} className="p-2 border rounded-md w-full" required />
                      </div>
                      <div className="flex justify-end gap-3 mt-6">
                          <button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Salvar</button>
                      </div>
                  </form>
              )}
          </Modal>

          <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirmar Exclusão">
              {selectedReminder && (
                  <div>
                      {modalError && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{modalError}</div>}
                      <p className="text-gray-700 mb-6">Tem a certeza que deseja apagar o lembrete: "{selectedReminder.description}"?</p>
                      <div className="flex justify-end gap-3">
                          <button type="button" onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                          <button type="button" onClick={confirmDelete} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">Apagar</button>
                      </div>
                  </div>
              )}
          </Modal>
      </div>
  );
};

const PlanejamentoView = ({ plannedExpenses, setPlannedExpenses, phoneNumber }) => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);
    const [modalError, setModalError] = useState('');
    const API_BASE_URL = 'https://meu-gestor-fernando.onrender.com';

    const handleStatusChange = async (expenseId, monthKey, newStatus) => {
        const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
        try {
            const response = await fetch(`${API_BASE_URL}/api/planning/status/${expenseId}?phone_number=${cleanPhoneNumber}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ monthKey, status: newStatus }),
            });
            if (!response.ok) throw new Error('Falha ao atualizar o status.');
            
            setPlannedExpenses(prev => prev.map(exp => {
                if (exp.id === expenseId) {
                    const newStatuses = { ...exp.statuses, [monthKey]: newStatus };
                    return { ...exp, statuses: newStatuses };
                }
                return exp;
            }));
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSaveExpense = async (name, dueDay) => {
        const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
        setModalError('');
        
        try {
            let response;
            if (editingExpense) {
                response = await fetch(`${API_BASE_URL}/api/planning/${editingExpense.id}?phone_number=${cleanPhoneNumber}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, dueDay: parseInt(dueDay) }),
                });
                if (!response.ok) throw new Error('Falha ao editar conta.');
                const updatedExpense = await response.json();
                setPlannedExpenses(prev => prev.map(exp => exp.id === editingExpense.id ? { ...exp, name: updatedExpense.name, dueDay: updatedExpense.dueDay } : exp));
            } else {
                response = await fetch(`${API_BASE_URL}/api/planning/${cleanPhoneNumber}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, dueDay: parseInt(dueDay) }),
                });
                if (!response.ok) throw new Error('Falha ao criar conta.');
                const newExpense = await response.json();
                setPlannedExpenses(prev => [...prev, newExpense]);
            }
            setIsModalOpen(false);
        } catch (err) {
            setModalError(err.message);
        }
    };

    const handleDeleteExpense = async (expenseId) => {
        if (!window.confirm("Tem certeza que deseja apagar esta conta do planejamento?")) return;
        
        const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
        try {
            const response = await fetch(`${API_BASE_URL}/api/planning/${expenseId}?phone_number=${cleanPhoneNumber}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Falha ao apagar conta.');
            setPlannedExpenses(prev => prev.filter(exp => exp.id !== expenseId));
        } catch (err) {
            alert(err.message);
        }
    };

    const openModal = (expense = null) => {
        setEditingExpense(expense);
        setModalError('');
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button onClick={() => setCurrentYear(y => y - 1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors"><ArrowLeft size={20} /></button>
                    <h2 className="text-2xl font-bold flex items-center"><Calendar size={24} className="mr-2 text-blue-600" /> {currentYear}</h2>
                    <button onClick={() => setCurrentYear(y => y + 1)} className="p-2 rounded-full hover:bg-gray-200 transition-colors"><ArrowRight size={20} /></button>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                    <PlusCircle size={20} className="mr-2" />
                    Adicionar Conta
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                {plannedExpenses.length > 0 ? (
                    <PlanningTable 
                        expenses={plannedExpenses} 
                        year={currentYear}
                        onStatusChange={handleStatusChange}
                        onEdit={openModal}
                        onDelete={handleDeleteExpense}
                    />
                ) : (
                    <div className="text-center py-16 px-6">
                        <h3 className="text-xl font-semibold text-gray-800">Nenhuma conta planejada ainda</h3>
                        <p className="text-gray-500 mt-2 mb-6">Comece a organizar suas contas fixas mensais clicando no botão "Adicionar Conta".</p>
                        <button
                            onClick={() => openModal()}
                            className="flex items-center mx-auto bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700">
                            <PlusCircle size={20} className="mr-2" />
                            Adicionar Primeira Conta
                        </button>
                    </div>
                )}
            </div>

            <PlannedExpenseModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveExpense}
                expense={editingExpense}
                error={modalError}
            />
        </div>
    );
};

const PlanningTable = ({ expenses, year, onStatusChange, onEdit, onDelete }) => {
    const months = useMemo(() => Array.from({ length: 12 }, (_, i) => {
        const date = new Date(year, i, 1);
        return date.toLocaleString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase();
    }), [year]);

    return (
        <table className="w-full min-w-[1000px]">
            <thead>
                <tr className="bg-gray-50">
                    <th className="text-left font-semibold text-gray-600 p-3 w-1/4">Conta Planejada</th>
                    {months.map(month => (
                        <th key={month} className="text-center font-semibold text-gray-600 p-3">{month}</th>
                    ))}
                    <th className="text-center font-semibold text-gray-600 p-3">Ações</th>
                </tr>
            </thead>
            <tbody>
                {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-gray-200 last:border-0 hover:bg-gray-50">
                        <td className="p-3 font-medium">
                            <div className="flex flex-col">
                                <span className="text-gray-800">{expense.name}</span>
                                <span className="text-xs text-gray-500">Vence todo dia {expense.dueDay}</span>
                            </div>
                        </td>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                            <td key={`${expense.id}-${month}`} className="p-3 text-center">
                                <StatusSelector
                                    expense={expense}
                                    month={month}
                                    year={year}
                                    onStatusChange={onStatusChange}
                                />
                            </td>
                        ))}
                        <td className="p-3 text-center">
                            <ActionMenu 
                                onEdit={() => onEdit(expense)}
                                onDelete={() => onDelete(expense.id)}
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const StatusSelector = ({ expense, month, year, onStatusChange }) => {
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    const actualStatus = expense.statuses?.[monthKey];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(year, month, 0);

    let displayStatus;
    let isDisabled = false;
    const effectiveStatus = actualStatus || 'Pendente';

    if (endOfMonth < today) {
        if (!actualStatus) {
            displayStatus = 'N/A';
            isDisabled = true;
        } else if (actualStatus === 'Pendente') {
            displayStatus = 'Atrasado';
        } else {
            displayStatus = 'Pago';
        }
    } else {
        displayStatus = actualStatus === 'Pago' ? 'Pago' : 'Pendente';
    }
    
    const getStatusClasses = () => {
        switch (displayStatus) {
            case 'Pago': return 'bg-green-100 text-green-800 border-green-300';
            case 'Pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'Atrasado': return 'bg-red-100 text-red-800 border-red-300';
            case 'N/A': return 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed';
            default: return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <select
            value={effectiveStatus}
            onChange={(e) => onStatusChange(expense.id, monthKey, e.target.value)}
            disabled={isDisabled}
            className={`text-xs font-medium py-1 px-2 rounded-full border appearance-none text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${getStatusClasses()}`}
        >
            <option value={effectiveStatus} hidden>{displayStatus}</option>
            <option value="Pago">Pago</option>
            <option value="Pendente">Pendente</option>
        </select>
    );
};

const ActionMenu = ({ onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative inline-block text-left">
            <button onClick={() => setIsOpen(!isOpen)} onBlur={() => setTimeout(() => setIsOpen(false), 150)} className="p-2 rounded-full hover:bg-gray-200">
                <MoreVertical size={20} />
            </button>
            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                        <button onClick={onEdit} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                            <Edit size={16} className="mr-2" /> Editar
                        </button>
                        <button onClick={onDelete} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                            <Trash2 size={16} className="mr-2" /> Apagar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const PlannedExpenseModal = ({ isOpen, onClose, onSave, expense, error }) => {
    const [name, setName] = useState('');
    const [dueDay, setDueDay] = useState('');

    useEffect(() => {
        if (expense) {
            setName(expense.name);
            setDueDay(expense.dueDay);
        } else {
            setName('');
            setDueDay('');
        }
    }, [expense, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && dueDay > 0 && dueDay <= 31) {
            onSave(name, dueDay);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={expense ? 'Editar Conta Planejada' : 'Adicionar Nova Conta'}>
            <form onSubmit={handleSubmit}>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</div>}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome da Conta</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Aluguel, Internet"
                        className="p-2 border rounded-md w-full"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="dueDay" className="block text-sm font-medium text-gray-700 mb-1">Dia do Vencimento</label>
                    <input
                        type="number"
                        id="dueDay"
                        value={dueDay}
                        onChange={(e) => setDueDay(e.target.value)}
                        placeholder="Ex: 5, 15, 25"
                        min="1"
                        max="31"
                        className="p-2 border rounded-md w-full"
                        required
                    />
                </div>
                 <div className="flex justify-end gap-3 mt-6">
                    <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Salvar</button>
                </div>
            </form>
        </Modal>
    );
};


const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [apiData, setApiData] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [plannedExpenses, setPlannedExpenses] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]); // NOVO ESTADO PARA PONTO
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('visaoGeral');

  const API_BASE_URL = 'https://meu-gestor-fernando.onrender.com';

  const handleFetchData = async (numberToFetch) => {
    const finalNumber = numberToFetch || phoneNumber;
    if (!finalNumber) {
      setError('Por favor, insira um número de telefone.');
      return;
    }
    setLoading(true);
    setError(null);
    setApiData(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/data/${finalNumber}`);
      if (!response.ok) throw new Error('Falha ao buscar dados. Verifique o número e tente novamente.');
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setApiData(result);
      setCategories(result.categories || []);
      setReminders(result.reminders || []);
      setPlannedExpenses(result.planned_expenses || []);
      setTimeLogs(result.time_logs || []); // CARREGA OS DADOS DO PONTO
    } catch (err) {
      setError(err.message);
      localStorage.removeItem('meuGestorNumero'); 
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('meuGestorNumero');
    setPhoneNumber('');
    setApiData(null);
    setAllTransactions([]);
    setCategories([]);
    setReminders([]);
    setPlannedExpenses([]);
    setTimeLogs([]); // LIMPA OS DADOS DO PONTO
    setError(null);
    setActiveView('visaoGeral');
  };

  useEffect(() => {
    const initializeApp = async () => {
      const savedNumber = localStorage.getItem('meuGestorNumero');
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (savedNumber) {
        setPhoneNumber(savedNumber);
        await handleFetchData(savedNumber);
      } else if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/verify-token/${token}`);
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail || 'Link de acesso inválido ou expirado.');
          }
          const data = await response.json();
          
          localStorage.setItem('meuGestorNumero', data.phone_number);
          setPhoneNumber(data.phone_number);
          
          await handleFetchData(data.phone_number);
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initializeApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (apiData) {
        const expenses = apiData.expenses.map(e => ({ ...e, type: 'expense' }));
        const incomes = apiData.incomes.map(i => ({ ...i, type: 'income' }));
        setAllTransactions([...expenses, ...incomes].sort((a, b) => new Date(b.date) - new Date(a.date)));
    }
  }, [apiData]);

  const processedData = useMemo(() => {
    if (!apiData) return null;

    const totalIncome = apiData.incomes.reduce((sum, item) => sum + item.value, 0);
    const totalExpense = apiData.expenses.reduce((sum, item) => sum + item.value, 0);
    const balance = totalIncome - totalExpense;

    const expenseByCategory = apiData.expenses.reduce((acc, expense) => {
      const category = expense.category || 'Outros';
      const existing = acc.find(item => item.name === category);
      if (existing) existing.value += expense.value;
      else acc.push({ name: category, value: expense.value });
      return acc;
    }, []).sort((a, b) => b.value - a.value);
    
    const expensesGrouped = apiData.expenses.reduce((acc, expense) => {
        const category = expense.category || 'Outros';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(expense);
        return acc;
    }, {});
    
    const sortedExpensesGrouped = Object.entries(expensesGrouped)
      .sort(([, aData], [, bData]) => {
        const aTotal = aData.reduce((sum, item) => sum + item.value, 0);
        const bTotal = bData.reduce((sum, item) => sum + item.value, 0);
        return bTotal - aTotal;
      })
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      
    return { totalIncome, totalExpense, balance, expenseByCategory, expensesGrouped: sortedExpensesGrouped };
  }, [apiData]);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Header 
        onFetch={() => handleFetchData(phoneNumber)} 
        loading={loading} 
        phoneNumber={phoneNumber} 
        setPhoneNumber={setPhoneNumber} 
        activeView={activeView} 
        setActiveView={setActiveView}
        handleLogout={handleLogout}
        isLoggedIn={!!apiData}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-center">
            <AlertCircle className="mr-3"/>
            <span>{error}</span>
          </div>
        )}

        {!apiData && !loading && !error && (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <Wallet size={48} className="mx-auto text-blue-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Bem-vindo ao seu Painel Financeiro</h2>
            <p className="text-gray-500 mt-2 max-w-md mx-auto">Para começar, peça seu link de acesso pessoal ao assistente no WhatsApp ou, se já tiver um, insira seu número e clique em carregar.</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <Loader className="animate-spin text-blue-600 mx-auto" size={48}/>
            <p className="mt-4 text-gray-600">Analisando suas finanças...</p>
          </div>
        )}

        {processedData && (
          <>
            {activeView === 'visaoGeral' && <VisaoGeralView stats={processedData} />}
            {activeView === 'ponto' && <PontoView timeLogs={timeLogs} />}
            {activeView === 'categorias' && <CategoriasView expensesGrouped={processedData.expensesGrouped} />}
            {activeView === 'tabela' && <TabelaTransacoesView transactions={allTransactions} setTransactions={setAllTransactions} phoneNumber={phoneNumber} categories={categories} setCategories={setCategories} />}
            {activeView === 'gerenciarCategorias' && <GerenciarCategoriasView categories={categories} setCategories={setCategories} phoneNumber={phoneNumber} />}
            {activeView === 'agenda' && <AgendaView reminders={reminders} setReminders={setReminders} phoneNumber={phoneNumber} />}
            {activeView === 'planejamento' && <PlanejamentoView plannedExpenses={plannedExpenses} setPlannedExpenses={setPlannedExpenses} phoneNumber={phoneNumber} />}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
