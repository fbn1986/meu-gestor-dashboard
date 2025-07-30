import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from 'recharts';
import { Search, Loader, AlertCircle, TrendingUp, TrendingDown, DollarSign, Wallet, LayoutDashboard, List, ChevronDown, ChevronUp } from 'lucide-react';

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
            onClick={onFetch}
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


// --- Componente Principal ---
const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('visaoGeral');

  const handleFetchData = async () => {
    if (!phoneNumber) { setError('Por favor, insira um número de telefone.'); return; }
    setLoading(true); setError(null); setApiData(null);
    try {
      const API_URL = `https://meu-gestor-fernando.onrender.com/api/data/${phoneNumber}`;
      const response = await fetch(API_URL);
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
    
    // Ordena o objeto de categorias pelo total gasto em cada uma
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
          </>
        )}
      </div>
    </div>
  );
};

export default App;