'use client'

import { useState, useEffect } from 'react'
import { Download, Trash2, RotateCcw } from 'lucide-react'

interface SavedAccount {
  id: string
  key: string
  savedAt: string
}

export default function Home() {
  const [accountKey, setAccountKey] = useState('')
  const [saveAccounts, setSaveAccounts] = useState(true)
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([])

  // Carregar contas salvas do localStorage
  useEffect(() => {
    const stored = localStorage.getItem('metralha_accounts')
    if (stored) {
      setSavedAccounts(JSON.parse(stored))
    }
  }, [])

  // Salvar contas no localStorage
  const saveToStorage = (accounts: SavedAccount[]) => {
    localStorage.setItem('metralha_accounts', JSON.stringify(accounts))
    setSavedAccounts(accounts)
  }

  const handleLogin = () => {
    if (!accountKey.trim()) {
      alert('Por favor, insira a chave da conta!')
      return
    }

    if (saveAccounts) {
      const newAccount: SavedAccount = {
        id: Date.now().toString(),
        key: accountKey,
        savedAt: new Date().toLocaleString('pt-BR')
      }
      const updatedAccounts = [newAccount, ...savedAccounts]
      saveToStorage(updatedAccounts)
    }

    alert(`Login realizado com a chave: ${accountKey}`)
    setAccountKey('')
  }

  const handleRestore = (key: string) => {
    setAccountKey(key)
    alert('Conta restaurada! Clique em LOGIN para entrar.')
  }

  const handleRemove = (id: string) => {
    const updatedAccounts = savedAccounts.filter(acc => acc.id !== id)
    saveToStorage(updatedAccounts)
  }

  const handleDownload = () => {
    alert('Download iniciado!')
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop&q=80)',
        backgroundColor: '#0a0a0a'
      }}
    >
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Card principal */}
      <div className="relative w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-700/50">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white tracking-wider">
              METRALHA STORE
            </h1>
            <button
              onClick={handleDownload}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span className="text-sm font-medium">Download</span>
            </button>
          </div>

          {/* Formulário de Login */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Chave da Conta
              </label>
              <input
                type="text"
                value={accountKey}
                onChange={(e) => setAccountKey(e.target.value)}
                placeholder="Digite a chave da sua conta"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg px-6 py-3 transition-all duration-200 hover:scale-105 shadow-lg"
            >
              LOGIN
            </button>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="saveAccounts"
                checked={saveAccounts}
                onChange={(e) => setSaveAccounts(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
              />
              <label htmlFor="saveAccounts" className="text-white text-sm cursor-pointer">
                Salvar contas anteriores
              </label>
            </div>
          </div>

          {/* Lista de Contas Salvas */}
          {savedAccounts.length > 0 && (
            <div className="border-t border-gray-700 pt-6">
              <h2 className="text-white font-semibold mb-4">Contas Salvas</h2>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {savedAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="bg-gray-800/50 rounded-lg p-3 flex items-center justify-between gap-3 border border-gray-700/50 hover:border-gray-600 transition-all"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {account.key}
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        {account.savedAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRestore(account.key)}
                        className="bg-green-500 hover:bg-green-600 text-white rounded-lg p-2 transition-all duration-200 hover:scale-110"
                        title="Restaurar conta"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemove(account.id)}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 transition-all duration-200 hover:scale-110"
                        title="Remover conta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
