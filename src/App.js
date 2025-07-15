import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Search, Loader, AlertCircle } from 'lucide-react';

// Cores para os gráficos de pizza
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4d', '#4dff4d'];

// Componente para os cards de estatísticas
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">R$ {value.toFixed(2).replace('.', ',')}</p>
    </div>
  </div>
);

// Componente principal da aplicação
const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchData = async () => {
    if (!phoneNumber) {
      setError('Por favor, insira um número de telefone.');
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      // IMPORTANTE: Substitua pela URL do seu backend na Render
      const API_URL = `https://meu-gestor-fernando.onrender.com/api/data/${phoneNumber}`;
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Falha ao buscar dados. Verifique o número e tente novamente.');
      }
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Calcula os dados para os gráficos apenas quando os dados da API mudam
  const chartData = useMemo(() => {
    if (!data) return { totalIncome: 0, totalExpense: 0, balance: 0, expenseByCategory: [], expenseOverTime: [] };

    const totalIncome = data.incomes.reduce((sum, item) => sum + item.value, 0);
    const totalExpense = data.expenses.reduce((sum, item) => sum + item.value, 0);
    const balance = totalIncome - totalExpense;

    const expenseByCategory = data.expenses.reduce((acc, expense) => {
      const category = expense.category || 'Outros';
      const existing = acc.find(item => item.name === category);
      if (existing) {
        existing.value += expense.value;
      } else {
        acc.push({ name: category, value: expense.value });
      }
      return acc;
    }, []);
    
    const expenseOverTime = data.expenses
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .reduce((acc, expense) => {
        const date = new Date(expense.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        const existing = acc.find(item => item.date === date);
        if (existing) {
          existing.value += expense.value;
        } else {
          acc.push({ date, value: expense.value });
        }
        return acc;
      }, []);

    return { totalIncome, totalExpense, balance, expenseByCategory, expenseOverTime };
  }, [data]);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Meu Gestor Financeiro</h1>
          <div className="flex items-center space-x-2">
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Seu nº de WhatsApp (ex: 5521...)"
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500 transition w-48"
              onKeyPress={(e) => e.key === 'Enter' && handleFetchData()}
            />
            <button
              onClick={handleFetchData}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center disabled:bg-gray-400"
            >
              {loading ? <Loader className="animate-spin mr-2" size={20}/> : <Search size={20} className="mr-2"/>}
              Carregar
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md flex items-center">
            <AlertCircle className="mr-3"/>
            <span>{error}</span>
          </div>
        )}

        {!data && !loading && !error && (
            <div className="text-center py-20 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-gray-700">Bem-vindo ao seu painel!</h2>
                <p className="text-gray-500 mt-2">Insira seu número de telefone acima para carregar seus dados financeiros.</p>
            </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <Loader className="animate-spin text-blue-600 mx-auto" size={48}/>
            <p className="mt-4 text-gray-600">Carregando seus dados...</p>
          </div>
        )}

        {data && (
          <div className="space-y-8">
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard title="Total de Receitas" value={chartData.totalIncome} icon={<TrendingUp size={24} className="text-green-800"/>} color="bg-green-100"/>
              <StatCard title="Total de Despesas" value={chartData.totalExpense} icon={<TrendingDown size={24} className="text-red-800"/>} color="bg-red-100"/>
              <StatCard title="Balanço Final" value={chartData.balance} icon={<DollarSign size={24} className="text-blue-800"/>} color="bg-blue-100"/>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Despesas por Categoria</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={chartData.expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                      {chartData.expenseByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R$ ${value.toFixed(2).replace('.', ',')}`}/>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Fluxo de Caixa (Receita vs. Despesa)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[{ name: 'Fluxo', Receita: chartData.totalIncome, Despesa: chartData.totalExpense }]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `R$${value/1000}k`}/>
                    <Tooltip formatter={(value) => `R$ ${value.toFixed(2).replace('.', ',')}`}/>
                    <Legend />
                    <Bar dataKey="Receita" fill="#82ca9d" />
                    <Bar dataKey="Despesa" fill="#ff4d4d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Gráfico de Linha */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Despesas ao Longo do Tempo</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData.expenseOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis tickFormatter={(value) => `R$${value}`}/>
                        <Tooltip formatter={(value) => `R$ ${value.toFixed(2).replace('.', ',')}`}/>
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" name="Gasto Diário" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Tabela de Transações Recentes */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-4">Últimas Transações</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 px-2">Tipo</th>
                      <th className="py-2 px-2">Descrição</th>
                      <th className="py-2 px-2">Valor</th>
                      <th className="py-2 px-2">Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...data.incomes, ...data.expenses]
                      .sort((a,b) => new Date(b.date) - new Date(a.date))
                      .slice(0, 10) // Pega as 10 últimas transações
                      .map(item => (
                        <tr key={`${item.id}-${item.value}`} className="border-b hover:bg-gray-50">
                          <td className="py-2 px-2">
                            {item.category ? 
                              <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Despesa</span> : 
                              <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">Receita</span>
                            }
                          </td>
                          <td className="py-2 px-2">{item.description}</td>
                          <td className={`py-2 px-2 font-semibold ${item.category ? 'text-red-600' : 'text-green-600'}`}>
                            R$ {item.value.toFixed(2).replace('.', ',')}
                          </td>
                          <td className="py-2 px-2 text-sm text-gray-500">{new Date(item.date).toLocaleDateString('pt-BR')}</td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
