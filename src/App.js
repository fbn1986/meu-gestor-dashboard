import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
import { Search, Loader, AlertCircle, ChevronLeft, ChevronRight, Calendar, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

// Cores para o gráfico de pizza
const COLORS = ['#3b82f6', '#10b981', '#f97316', '#ef4444', '#8b5cf6', '#ec4899', '#f59e0b'];

// --- Componentes da UI ---

const Header = ({ onFetch, loading, phoneNumber, setPhoneNumber }) => (
  <header className="bg-white shadow-sm sticky top-0 z-20">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-between items-center gap-4">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Meu Gestor</h1>
      <div className="flex items-center space-x-2">
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Seu nº de WhatsApp (5521...)"
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
  </header>
);

const Sidebar = ({ stats }) => (
  <aside className="w-full lg:w-1/4 space-y-6">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-md font-semibold text-gray-500 mb-1">Resultado do Período</h3>
      <p className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        R$ {stats.balance.toFixed(2).replace('.', ',')}
      </p>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><TrendingUp className="text-green-500 mr-2" /> Entradas</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Realizado</span>
          <span className="font-bold text-green-600">R$ {stats.totalIncome.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><TrendingDown className="text-red-500 mr-2" /> Saídas</h3>
       <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Realizado</span>
          <span className="font-bold text-red-600">R$ {stats.totalExpense.toFixed(2).replace('.', ',')}</span>
        </div>
      </div>
    </div>
  </aside>
);

const ActiveShapePieChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    return (
      <g>
        <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="font-bold text-lg">{payload.name}</text>
        <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill="#333">{`R$ ${value.toFixed(2).replace('.', ',')}`}</text>
        <text x={cx} y={cy + 30} dy={8} textAnchor="middle" fill="#999">{`( ${(percent * 100).toFixed(2)}% )`}</text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke="#fff"
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={110}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};


const MainContent = ({ stats, balanceOverTime, expenseByCategory }) => (
  <main className="w-full lg:w-3/4 space-y-8">
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Evolução do Saldo no Período</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={balanceOverTime}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => `R$${value/1000}k`} />
          <Tooltip formatter={(value) => `R$ ${value.toFixed(2).replace('.', ',')}`}/>
          <Legend />
          <Area type="monotone" dataKey="saldo" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="Saldo Acumulado" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Despesas por Categoria</h3>
      <ActiveShapePieChart data={expenseByCategory} />
    </div>
  </main>
);

// --- Componente Principal ---
const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchData = async () => {
    if (!phoneNumber) {
      setError('Por favor, insira um número de telefone.');
      return;
    }
    setLoading(true);
    setError(null);
    setApiData(null);
    try {
      // IMPORTANTE: Use a URL do seu backend na Render
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

    const allTransactions = [
      ...apiData.incomes.map(t => ({ ...t, type: 'income' })),
      ...apiData.expenses.map(t => ({ ...t, type: 'expense' }))
    ].sort((a, b) => new Date(a.date) - new Date(b.date));

    let cumulativeBalance = 0;
    const balanceOverTime = allTransactions.reduce((acc, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      cumulativeBalance += transaction.type === 'income' ? transaction.value : -transaction.value;
      
      const existingEntry = acc.find(e => e.date === date);
      if (existingEntry) {
        existingEntry.saldo = cumulativeBalance;
      } else {
        acc.push({ date, saldo: cumulativeBalance });
      }
      return acc;
    }, []);

    const totalIncome = apiData.incomes.reduce((sum, item) => sum + item.value, 0);
    const totalExpense = apiData.expenses.reduce((sum, item) => sum + item.value, 0);
    const balance = totalIncome - totalExpense;

    const expenseByCategory = apiData.expenses.reduce((acc, expense) => {
      const category = expense.category || 'Outros';
      const existing = acc.find(item => item.name === category);
      if (existing) existing.value += expense.value;
      else acc.push({ name: category, value: expense.value });
      return acc;
    }, []);

    return { totalIncome, totalExpense, balance, expenseByCategory, balanceOverTime };
  }, [apiData]);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Header onFetch={handleFetchData} loading={loading} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />
      
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
          <div className="flex flex-col lg:flex-row gap-8">
            <Sidebar stats={processedData} />
            <MainContent stats={processedData} balanceOverTime={processedData.balanceOverTime} expenseByCategory={processedData.expenseByCategory} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
