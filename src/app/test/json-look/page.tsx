'use client'

import React, { useState } from 'react'
import troubleData from '@/features/ai-agent/agents/Trouble/data/trouble-database.json'
import { ChevronDown, ChevronRight, FileText, Tag, Hash, Calendar, Building, Lock, Search, Info } from 'lucide-react'

export default function JsonLookPage() {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (sectionKey: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionKey)) {
      newExpanded.delete(sectionKey)
    } else {
      newExpanded.add(sectionKey)
    }
    setExpandedSections(newExpanded)
  }

  const documents = Object.entries(troubleData.knowledge_base)
  
  const searchInObject = (obj: any, term: string): boolean => {
    const searchLower = term.toLowerCase()
    const searchJson = JSON.stringify(obj).toLowerCase()
    return searchJson.includes(searchLower)
  }

  const filteredDocuments = documents.filter(([docId, docData]) => {
    if (!searchTerm) return true
    return searchInObject(docData, searchTerm)
  })

  const renderValue = (value: any, key: string, path: string = ''): JSX.Element => {
    const currentPath = path ? `${path}.${key}` : key
    
    if (value === null) return <span className="text-gray-400">null</span>
    if (typeof value === 'boolean') return <span className={value ? 'text-green-600' : 'text-red-600'}>{value.toString()}</span>
    if (typeof value === 'string' || typeof value === 'number') {
      return <span className="text-green-700">"{value}"</span>
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) return <span className="text-gray-500">[]</span>
      if (value.every(item => typeof item === 'string' || typeof item === 'number')) {
        return (
          <span className="text-purple-600">
            [{value.map((item, i) => <span key={i}>"{item}"{i < value.length - 1 ? ', ' : ''}</span>)}]
          </span>
        )
      }
      
      const isExpanded = expandedSections.has(currentPath)
      return (
        <>
          <button
            onClick={() => toggleSection(currentPath)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? <ChevronDown className="w-3 h-3 inline" /> : <ChevronRight className="w-3 h-3 inline" />}
            <span className="ml-1">[{value.length} items]</span>
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1">
              {value.map((item, index) => (
                <div key={index} className="py-1">
                  <span className="text-gray-500">{index}:</span> {renderValue(item, index.toString(), currentPath)}
                </div>
              ))}
            </div>
          )}
        </>
      )
    }
    
    if (typeof value === 'object') {
      const isExpanded = expandedSections.has(currentPath)
      const entries = Object.entries(value)
      
      return (
        <>
          <button
            onClick={() => toggleSection(currentPath)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? <ChevronDown className="w-3 h-3 inline" /> : <ChevronRight className="w-3 h-3 inline" />}
            <span className="ml-1">{`{${entries.length} fields}`}</span>
          </button>
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {entries.map(([k, v]) => (
                <div key={k} className="flex items-start">
                  <span className="text-blue-600 font-medium mr-2 flex-shrink-0">"{k}":</span>
                  <div className="flex-1">{renderValue(v, k, currentPath)}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )
    }
    
    return <span className="text-gray-500">{JSON.stringify(value)}</span>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Knowledge Base Viewer</h1>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search in documents..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Documents ({filteredDocuments.length})
                </h2>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {filteredDocuments.map(([docId, docData]) => {
                  const metadata = (docData as any).document_metadata
                  return (
                    <div
                      key={docId}
                      className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 p-4 ${
                        selectedDocument === docId ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => setSelectedDocument(docId)}
                    >
                      <h3 className="font-medium text-gray-900 mb-1">{metadata?.title || docId}</h3>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-2 mb-1">
                          <Building className="w-3 h-3" />
                          <span>{metadata?.client || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          <span>{metadata?.date || 'N/A'}</span>
                        </div>
                        {metadata?.confidentiality && (
                          <div className="flex items-center gap-2 mt-1 text-red-600">
                            <Lock className="w-3 h-3" />
                            <span>{metadata.confidentiality}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Document Detail */}
          <div className="lg:col-span-2">
            {selectedDocument ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {(() => {
                  const docData = troubleData.knowledge_base[selectedDocument as keyof typeof troubleData.knowledge_base]
                  if (!docData) return null
                  
                  return (
                    <>
                      {/* Document Header */}
                      <div className="p-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-900">
                          {docData.document_metadata?.title || selectedDocument}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          Document ID: {selectedDocument}
                        </p>
                      </div>

                      {/* Keywords */}
                      {docData.searchable_keywords && (
                        <div className="p-4 border-b border-gray-200">
                          <h3 className="text-sm font-medium text-gray-700 mb-2">Searchable Keywords</h3>
                          <div className="flex flex-wrap gap-2">
                            {docData.searchable_keywords.map((keyword: string) => (
                              <span
                                key={keyword}
                                className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full"
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Document Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Structure</h3>
                        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                          {Object.entries(docData).map(([key, value]) => (
                            <div key={key} className="mb-2">
                              <span className="text-blue-600 font-medium">"{key}":</span>
                              <div className="ml-4">
                                {renderValue(value, key)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Select a document to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <Info className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700">Database Metadata</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Version:</span>
              <span className="ml-2 font-medium">{troubleData.metadata.version}</span>
            </div>
            <div>
              <span className="text-gray-500">Last Updated:</span>
              <span className="ml-2 font-medium">{troubleData.metadata.last_updated}</span>
            </div>
            <div>
              <span className="text-gray-500">Structure:</span>
              <span className="ml-2 font-medium">{troubleData.metadata.data_structure}</span>
            </div>
            <div>
              <span className="text-gray-500">Optimization:</span>
              <span className="ml-2 font-medium">{troubleData.metadata.optimization}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}