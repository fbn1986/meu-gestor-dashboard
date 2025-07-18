import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { Search, Loader, AlertCircle, TrendingUp, TrendingDown, DollarSign, Wallet, LayoutDashboard, List, ChevronDown, ChevronUp, Database, Edit, Trash2, X } from 'lucide-react';

// Cores para o gráfico e cards
const COLORS = ['#3b82f6', '#10b981', '#f97316', '#ef4444', '#8b5cf6', '#ec4899', '#f59e0b'];

// --- Componentes da UI ---

const Header = ({ onFetch, loading, phoneNumber, setPhoneNumber, activeView, setActiveView }) => (
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
          />
          <button
            onClick={() => onFetch()}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center disabled:bg-gray-400"
          >
            {loading ? <Loader className="animate-spin sm:mr-2" size={20}/> : <Search size={20} className="sm:mr-2"/>}
            <span className="hidden sm:inline">Carregar</span>
          </button>
        </div>
      </div>
      <nav className="flex space-x-4 sm:space-x-8 -mb-px">
        <button 
          onClick={() => setActiveView('visaoGeral')}
          className={`py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 ${activeView === 'visaoGeral' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          <LayoutDashboard size={16} /> Visão Geral
        </button>
        <button 
          onClick={() => setActiveView('categorias')}
          className={`py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 ${activeView === 'categorias' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          <List size={16} /> Categorias
        </button>
        <button 
          onClick={() => setActiveView('tabela')}
          className={`py-3 px-1 text-sm font-medium border-b-2 flex items-center gap-2 ${activeView === 'tabela' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
        >
          <Database size={16} /> Tabela
        </button>
      </nav>
    </div>
  </header>
);

const StatCard = ({ title, value, icon, colorClass }) => (
    <div className="bg-white p-4 rounded-lg shadow flex-1">
      <div className="flex items-center">
        <div className={`p-2 rounded-lg mr-4 ${colorClass}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xl font-bold text-gray-800">R$ {value.toFixed(2).replace('.', ',')}</p>
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
            <StatCard title="Receitas" value={stats.totalIncome} icon={<TrendingUp size={24} className="text-green-600"/>} colorClass="bg-green-100"/>
            <StatCard title="Despesas" value={stats.totalExpense} icon={<TrendingDown size={24} className="text-red-600"/>} colorClass="bg-red-100"/>
            <StatCard title="Balanço" value={stats.balance} icon={<DollarSign size={24} className="text-blue-600"/>} colorClass="bg-blue-100"/>
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

const TabelaTransacoesView = ({ transactions, setTransactions, phoneNumber, categories }) => {
    const [filterText, setFilterText] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [modalError, setModalError] = useState(null);
    
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
        const endpoint = type === 'expense' 
            ? `/api/expense/${id}?phone_number=${cleanPhoneNumber}` 
            : `/api/income/${id}?phone_number=${cleanPhoneNumber}`;
        
        const form = e.target;
        const updatedData = {
            description: form.elements.description.value,
            value: parseFloat(form.elements.value.value),
            ...(type === 'expense' && { category: form.elements.category.value })
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
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
                                <td className="px-6 py-4">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
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
                                <input type="text" name="category" defaultValue={selectedTransaction.category} className="p-2 border rounded-md w-full" />
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


// --- Componente Principal ---
const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [apiData, setApiData] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('visaoGeral');

  const API_BASE_URL = 'https://meu-gestor-fernando.onrender.com';

  // Função para buscar dados, agora aceita um número como argumento
  const handleFetchData = async (numberToFetch = phoneNumber) => {
    if (!numberToFetch) { 
      setError('Por favor, insira um número de telefone.'); 
      return; 
    }
    setLoading(true); 
    setError(null); 
    setApiData(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/data/${numberToFetch}`);
      if (!response.ok) throw new Error('Falha ao buscar dados. Verifique o número.');
      const result = await response.json();
      if (result.error) throw new Error(result.error);
      setApiData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para verificar o token na URL ao carregar a página
  useEffect(() => {
    const checkToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        setLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/api/verify-token/${token}`);
          if (!response.ok) {
            throw new Error('Link de acesso inválido ou expirado.');
          }
          const data = await response.json();
          setPhoneNumber(data.phone_number);
          // Chama a busca de dados passando o número recebido diretamente
          handleFetchData(data.phone_number);
          // Limpa o token da URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }
    };
    checkToken();
  }, []);

  // Efeito para combinar despesas e receitas num único array
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
      
    const allCategories = Object.keys(sortedExpensesGrouped);

    return { totalIncome, totalExpense, balance, expenseByCategory, expensesGrouped: sortedExpensesGrouped, allCategories };
  }, [apiData]);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Header onFetch={handleFetchData} loading={loading} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} activeView={activeView} setActiveView={setActiveView} />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-center">
            <AlertCircle className="mr-3"/>
            <span>{error}</span>
          </div>
        )}

        {!apiData && !loading && !error && (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-700">Bem-vindo ao seu Painel Financeiro</h2>
            <p className="text-gray-500 mt-2">Insira seu número de telefone e clique em carregar.</p>
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
            {activeView === 'categorias' && <CategoriasView expensesGrouped={processedData.expensesGrouped} />}
            {activeView === 'tabela' && <TabelaTransacoesView transactions={allTransactions} setTransactions={setAllTransactions} phoneNumber={phoneNumber} categories={processedData.allCategories} />}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
