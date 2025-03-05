# Prime Framework Knowledge Graph Library Specification

## 1. Overview

The Prime Framework Knowledge Graph (PFKG) is a JavaScript library implementing a coherence-based knowledge management system inspired by the Universal Object Reference (UOR) framework's mathematical principles. It provides a unified approach to storing, retrieving, analyzing, and visualizing knowledge using advanced embedding techniques derived from the Prime Framework's axioms.

## 2. Core Architectural Principles

The library is built on four key architectural principles mirroring the Prime Framework's axioms:

1. **Reference Structure** - A flexible graph topology serves as the spatial foundation for knowledge entities
2. **Multi-representational Embeddings** - Each entity is embedded using multiple mathematical bases
3. **Transformational Operations** - Coherence-preserving operations for knowledge manipulation
4. **Coherence Optimization** - Continuous refinement toward minimal-energy knowledge representations

## 3. Library Structure

```
prime-knowledge-graph/
├── core/
│   ├── pfkg.js                  # Main entry point and API surface
│   ├── database.js              # IndexedDB implementation
│   ├── embedding.js             # Entity embedding generation
│   ├── coherence.js             # Coherence calculation utilities
│   └── transforms.js            # Knowledge transformation operations
├── search/
│   ├── engine.js                # Search orchestration
│   ├── local-search.js          # Database search implementation
│   ├── query-processor.js       # Query analysis and embedding
│   └── external-adapters/       # External data source adapters
│       ├── wikidata.js
│       ├── schema-org.js
│       └── generic-api.js
├── zones/
│   ├── zone-manager.js          # Zone transition and management
│   ├── intrinsic.js             # Core knowledge management
│   └── extrinsic.js             # Peripheral knowledge with pruning
├── visualization/
│   ├── renderer.js              # Knowledge visualization core
│   ├── graph-view.js            # Network visualization
│   └── result-view.js           # Search result visualization
└── utils/
    ├── vector-math.js           # Vector operations
    ├── prime-utils.js           # Prime number utilities
    └── text-processor.js        # Text analysis utilities
```

## 4. Entity Schema

The fundamental unit of knowledge is an Entity with the following structure:

```javascript
{
  // Core identity
  id: String,                    // Unique identifier (UUID v4)
  type: String,                  // Entity type (Article, Person, Concept, etc.)
  name: String,                  // Primary label or title
  description: String,           // Brief descriptive text
  
  // Content
  properties: {                  // Flexible domain-specific properties
    [key: String]: any           // Any properties from source schema
  },
  
  // Provenance
  sources: [{                    // Origin information
    url: String,                 // Source URL
    retrievedAt: Date,           // Timestamp
    confidence: Number,          // 0.0-1.0 confidence score
    license: String              // License information if available
  }],
  
  // Prime Framework embedding
  embedding: {
    baseVector: Float32Array,    // Base dimensional representation
    representations: {           // Multiple mathematical representations
      binary: Float32Array,      // Binary basis projection  
      prime: Float32Array,       // Prime number basis projection
      frequency: Float32Array,   // Frequency domain representation
      semantic: Float32Array     // Semantic meaning projection
    },
    coherenceNorm: Number,       // Internal coherence measurement (0.0-1.0)
    primeFactors: Number[],      // Dominant prime factors in representation
    symmetryType: String         // 'radial', 'bilateral', or 'asymmetric'
  },
  
  // Relationships
  relations: [{                  // Connections to other entities
    type: String,                // Relationship type
    targetId: String,            // Target entity ID
    weight: Number,              // Relationship strength (0.0-1.0)
    bidirectional: Boolean,      // Whether relation goes both ways
    properties: Object           // Additional relationship attributes
  }],
  
  // Metadata
  metadata: {
    zone: "intrinsic"|"extrinsic", // Knowledge zone
    created: Date,               // Creation timestamp
    lastAccessed: Date,          // Last access timestamp
    accessCount: Number,         // Number of accesses/retrievals
    userTags: String[],          // User-assigned tags
    coherenceRank: Number,       // Global coherence ranking
    stateVector: Float32Array    // Internal state tracking
  }
}
```

## 5. Core APIs

### 5.1. Initialization and Configuration

```javascript
// Main class initialization
const knowledgeGraph = new PrimeKnowledgeGraph({
  dbName: String,                // IndexedDB name (default: "primeKnowledgeGraph")
  version: Number,               // Database version (default: 1)
  embedDimensions: Number,       // Base vector dimensions (default: 128)
  autoConnect: Boolean,          // Auto-init database (default: true)
  zoneConfig: {
    intrinsicThreshold: Number,  // Access count to auto-promote (default: 5)
    pruneThreshold: Number,      // Days until eligible for pruning (default: 30)
    prunePercentage: Number      // Max percentage to prune (default: 0.2)
  },
  searchConfig: {
    minLocalResults: Number,     // Min local results before external (default: 3)
    maxExternalResults: Number,  // Max external results to fetch (default: 10)
    defaultSources: String[]     // Default external sources (default: ['wikidata'])
  }
});

// Manual initialization if autoConnect is false
await knowledgeGraph.initialize();

// Get initialization status
const status = knowledgeGraph.status; // 'initializing', 'ready', 'error'
```

### 5.2. Entity Management

```javascript
// Add a new entity
const entityId = await knowledgeGraph.addEntity({
  type: 'Article',
  name: 'Introduction to Prime Framework',
  description: 'An overview of the mathematical principles...',
  properties: { /* ... */ }
}, 'extrinsic');  // Zone (default: 'extrinsic')

// Get entity by ID
const entity = await knowledgeGraph.getEntity(entityId);

// Update entity
await knowledgeGraph.updateEntity(entityId, {
  description: 'Updated description...',
  properties: { /* updated properties */ }
});

// Delete entity
await knowledgeGraph.deleteEntity(entityId);

// Create relationship between entities
await knowledgeGraph.createRelationship({
  sourceId: 'entity-id-1',
  targetId: 'entity-id-2',
  type: 'references',
  weight: 0.8,
  bidirectional: false,
  properties: { /* ... */ }
});
```

### 5.3. Search and Query

```javascript
// Basic search
const results = await knowledgeGraph.search('prime numbers', {
  limit: 10,                   // Max results (default: 10)
  threshold: 0.5,              // Min coherence score (default: 0.3)
  includeZones: ['intrinsic', 'extrinsic'], // Zones to search (default: both)
  sortBy: 'coherence'          // Sorting method (default: 'coherence')
});

// Advanced query with natural language
const nlResults = await knowledgeGraph.query({
  text: 'What is the relationship between prime numbers and consciousness?',
  type: 'natural',             // 'natural', 'structured', 'keyword'
  externalSources: true,       // Search external sources (default: false)
  sourceNames: ['wikidata', 'schema-org'], // Specific sources
  filters: {                   // Optional filters
    types: ['Concept', 'Article'],
    createdAfter: new Date('2023-01-01'),
    minCoherence: 0.7
  }
});

// Find related entities
const related = await knowledgeGraph.findRelated(entityId, {
  relationTypes: ['references', 'extends'],
  maxDistance: 2,              // Network distance (default: 1)
  minWeight: 0.5,              // Min relationship weight (default: 0.3)
  limit: 10                    // Max results (default: 10)
});
```

### 5.4. Zone Management

```javascript
// Promote entity to intrinsic zone
await knowledgeGraph.promoteToIntrinsic(entityId);

// Demote entity to extrinsic zone
await knowledgeGraph.demoteToExtrinsic(entityId);

// Prune extrinsic entities
const pruneResult = await knowledgeGraph.pruneExtrinsicEntities({
  olderThanDays: 45,           // Age threshold (default: 30)
  accessCountThreshold: 2,     // Max access count to prune (default: 3)
  coherenceThreshold: 0.4,     // Coherence threshold (default: 0.3)
  maxPrunePercentage: 0.3      // Max percentage to prune (default: 0.2)
});

// Get zone statistics
const stats = await knowledgeGraph.getZoneStatistics();
// Returns: { intrinsic: { count, averageCoherence, ... }, extrinsic: { ... } }
```

### 5.5. External Data Integration

```javascript
// Import knowledge from URL (auto-detects schema)
const importedIds = await knowledgeGraph.importFromURL('https://example.com/article', {
  targetZone: 'extrinsic',     // Target zone (default: 'extrinsic')
  parseOptions: { /* ... */ }  // Parsing options
});

// Import from specific data source
const wikiEntities = await knowledgeGraph.importFromSource('wikidata', {
  query: 'Prime number theory',
  limit: 5
});

// Register custom data source adapter
knowledgeGraph.registerExternalSource('custom-source', {
  search: async (query, options) => { /* ... */ },
  fetch: async (id, options) => { /* ... */ },
  parseResults: (results) => { /* ... */ }
});

// Export knowledge
const exportData = await knowledgeGraph.exportKnowledge({
  format: 'json',              // 'json', 'csv', 'rdf'
  zones: ['intrinsic'],        // Zones to export
  includeEmbeddings: false     // Whether to include embeddings
});
```

### 5.6. Knowledge Analysis and Visualization

```javascript
// Get knowledge graph summary
const summary = await knowledgeGraph.generateSummary();
// Returns statistics, top entities, clusters, etc.

// Find knowledge clusters
const clusters = await knowledgeGraph.findClusters({
  algorithm: 'community',      // Clustering algorithm
  minClusterSize: 3            // Min entities per cluster
});

// Generate visual graph data
const graphData = await knowledgeGraph.generateGraphData({
  centerEntityId: entityId,    // Optional focal entity
  maxEntities: 50,             // Max entities to include
  includeRelations: true,      // Whether to include relationships
  layout: 'force-directed'     // Graph layout algorithm
});

// Check knowledge coherence
const coherenceReport = await knowledgeGraph.analyzeCoherence({
  scope: 'global',             // 'global' or 'entity'
  entityId: entityId,          // Required if scope is 'entity'
  detailed: true               // Include detailed metrics
});
```

### 5.7. Events and Monitoring

```javascript
// Subscribe to events
knowledgeGraph.on('entityAdded', (entity) => { /* ... */ });
knowledgeGraph.on('entityUpdated', (entityId, changes) => { /* ... */ });
knowledgeGraph.on('entityDeleted', (entityId) => { /* ... */ });
knowledgeGraph.on('searchPerformed', (query, results) => { /* ... */ });
knowledgeGraph.on('zoneMigration', (entityId, fromZone, toZone) => { /* ... */ });
knowledgeGraph.on('prunedEntities', (count, entityIds) => { /* ... */ });

// Unsubscribe from events
knowledgeGraph.off('entityAdded');

// Get performance metrics
const metrics = knowledgeGraph.getPerformanceMetrics();
// Returns: { averageQueryTime, databaseSize, etc. }
```

## 6. Embedding and Coherence

The core of the Prime Framework Knowledge Graph is its embedding system, which transforms entities into multi-representational vectors following Prime Framework principles.

### 6.1. Embedding Generation

```javascript
// Core embedding process
function generateEmbedding(entity) {
  // 1. Convert entity to text representation
  const text = textProcessor.extractText(entity);
  
  // 2. Create base vector through dimensional reduction
  const baseVector = vectorizer.textToVector(text);
  
  // 3. Generate multiple representations
  const representations = {
    // Binary pattern representation
    binary: transforms.toBinaryBasis(baseVector),
    
    // Prime number representation (projecting onto prime dimensions)
    prime: transforms.toPrimeBasis(baseVector),
    
    // Frequency domain representation
    frequency: transforms.toFrequencyDomain(baseVector),
    
    // Semantic meaning representation
    semantic: transforms.toSemanticSpace(baseVector)
  };
  
  // 4. Calculate coherence norm (alignment between representations)
  const coherenceNorm = coherence.calculateNorm(representations);
  
  // 5. Extract prime factors (influential structural components)
  const primeFactors = primeUtils.extractDominantFactors(representations.prime);
  
  // 6. Determine symmetry type based on structure
  const symmetryType = coherence.determineSymmetryType(representations);
  
  return {
    baseVector,
    representations,
    coherenceNorm,
    primeFactors,
    symmetryType
  };
}
```

### 6.2. Coherence Calculation

```javascript
// Coherence between entities
function calculateCoherence(entityA, entityB) {
  // Calculate coherence across multiple representation spaces
  const binaryCoherence = vectorMath.cosineDistance(
    entityA.embedding.representations.binary,
    entityB.embedding.representations.binary
  );
  
  const primeCoherence = vectorMath.primeSimilarity(
    entityA.embedding.representations.prime,
    entityB.embedding.representations.prime,
    entityA.embedding.primeFactors,
    entityB.embedding.primeFactors
  );
  
  const semanticCoherence = vectorMath.cosineDistance(
    entityA.embedding.representations.semantic,
    entityB.embedding.representations.semantic
  );
  
  // Weight the coherence values
  const combinedCoherence = (
    binaryCoherence * 0.2 +
    primeCoherence * 0.5 +
    semanticCoherence * 0.3
  );
  
  return combinedCoherence;
}
```

## 7. Database Implementation

The library uses IndexedDB for persistent storage with the following structure:

### 7.1. Database Stores

```javascript
// Database initialization
function initDatabase(dbName, version) {
  const request = indexedDB.open(dbName, version);
  
  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    
    // Entity store
    const entityStore = db.createObjectStore('entities', { keyPath: 'id' });
    entityStore.createIndex('zone', 'metadata.zone', { unique: false });
    entityStore.createIndex('type', 'type', { unique: false });
    entityStore.createIndex('lastAccessed', 'metadata.lastAccessed', { unique: false });
    entityStore.createIndex('coherenceRank', 'metadata.coherenceRank', { unique: false });
    
    // Relationship store
    const relationStore = db.createObjectStore('relationships', { keyPath: 'id' });
    relationStore.createIndex('sourceId', 'sourceId', { unique: false });
    relationStore.createIndex('targetId', 'targetId', { unique: false });
    relationStore.createIndex('type', 'type', { unique: false });
    
    // Vector store (for efficient vector operations)
    const vectorStore = db.createObjectStore('vectors', { keyPath: 'entityId' });
    vectorStore.createIndex('zone', 'zone', { unique: false });
    
    // Search index store
    const searchStore = db.createObjectStore('searchIndices', { keyPath: 'term' });
    
    // Configuration store
    db.createObjectStore('config', { keyPath: 'key' });
  };
}
```

### 7.2. Optimized Search Index

```javascript
// Search index structure
{
  term: String,              // Search term or token
  entityIds: [               // Matching entities with weights
    { id: String, weight: Number },
    ...
  ],
  vector: Float32Array,      // Term embedding vector
  metadata: {
    frequency: Number,       // Term frequency
    lastUpdated: Date        // Last update timestamp
  }
}
```

## 8. Search Implementation

### 8.1. Local Search

```javascript
// Local search pipeline
async function searchLocal(queryEmbedding, options) {
  // 1. Get candidate entities from index if keyword search
  let candidates = [];
  
  if (options.type === 'keyword') {
    candidates = await getCandidatesFromIndex(options.query);
  } else {
    // For non-keyword search, get recent entities to start
    candidates = await getRecentEntities(100);
  }
  
  // 2. Calculate coherence scores against query embedding
  const scoredCandidates = await Promise.all(
    candidates.map(async candidate => {
      const entity = await getEntity(candidate.id);
      
      const score = calculateCoherence(
        queryEmbedding,
        entity.embedding
      );
      
      return {
        entity,
        score
      };
    })
  );
  
  // 3. Filter by threshold
  const thresholdedResults = scoredCandidates
    .filter(result => result.score >= options.threshold);
  
  // 4. Sort by score
  thresholdedResults.sort((a, b) => b.score - a.score);
  
  // 5. Apply limit
  return thresholdedResults.slice(0, options.limit);
}
```

### 8.2. External Search Adapters

```javascript
// Wikidata adapter example
const wikidataAdapter = {
  search: async (query, options) => {
    const response = await fetch(
      `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${
        encodeURIComponent(query)
      }&language=en&format=json&limit=${options.limit || 5}`
    );
    
    const data = await response.json();
    return data.search;
  },
  
  fetch: async (id) => {
    const response = await fetch(
      `https://www.wikidata.org/wiki/Special:EntityData/${id}.json`
    );
    
    const data = await response.json();
    return data.entities[id];
  },
  
  parseResults: (results) => {
    return results.map(result => ({
      id: `wikidata-${result.id}`,
      type: 'WikidataEntity',
      name: result.label,
      description: result.description,
      properties: result.claims,
      sources: [{
        url: `https://www.wikidata.org/wiki/${result.id}`,
        retrievedAt: new Date(),
        confidence: 0.9,
        license: 'CC0'
      }]
    }));
  }
};
```

## 9. Prime Framework Specific Features

### 9.1. Prime-Based Pattern Recognition

```javascript
// Recognize patterns in knowledge using prime factorization
async function recognizePrimePatterns(entityIds) {
  const entities = await Promise.all(
    entityIds.map(id => getEntity(id))
  );
  
  // Extract dominant prime factors
  const primeFactorSets = entities.map(entity => 
    entity.embedding.primeFactors
  );
  
  // Find common factors across entities
  const commonFactors = primeUtils.findCommonFactors(primeFactorSets);
  
  // Calculate pattern coherence
  const patternCoherence = primeUtils.calculateFactorCoherence(
    primeFactorSets,
    commonFactors
  );
  
  // Generate pattern description
  const patternDescription = primeUtils.describePattern(
    commonFactors,
    patternCoherence
  );
  
  return {
    pattern: commonFactors,
    coherence: patternCoherence,
    description: patternDescription
  };
}
```

### 9.2. Coherence Optimization

```javascript
// Optimize knowledge representation for maximum coherence
async function optimizeCoherence(entityIds) {
  const entities = await Promise.all(
    entityIds.map(id => getEntity(id))
  );
  
  // Calculate initial coherence
  const initialCoherence = calculateGroupCoherence(entities);
  
  // Generate potential optimizations (reweighting, relationship adjustments)
  const candidateOptimizations = generateOptimizationCandidates(entities);
  
  // Evaluate each optimization for coherence improvement
  const evaluatedOptimizations = candidateOptimizations.map(opt => ({
    optimization: opt,
    coherenceImprovement: evaluateCoherenceImprovement(entities, opt)
  }));
  
  // Select best optimization
  const bestOptimization = selectBestOptimization(evaluatedOptimizations);
  
  // Apply optimization
  await applyOptimization(bestOptimization, entities);
  
  // Get final coherence
  const finalCoherence = calculateGroupCoherence(
    await Promise.all(entityIds.map(id => getEntity(id)))
  );
  
  return {
    initialCoherence,
    finalCoherence,
    improvement: finalCoherence - initialCoherence,
    appliedOptimization: bestOptimization
  };
}
```

## 10. Advanced Features

### 10.1. Knowledge Exploration

```javascript
// Generate exploration paths through knowledge
async function generateExplorationPaths(startEntityId, options) {
  const paths = [];
  const startEntity = await getEntity(startEntityId);
  
  // Get exploration frontier (related entities)
  const relatedEntities = await findRelatedEntities(startEntityId, {
    maxDistance: 1,
    minWeight: 0.6
  });
  
  // Group by coherence clusters
  const clusters = clusterByCoherence(relatedEntities);
  
  // For each cluster, generate a path
  for (const cluster of clusters) {
    // Find central entity in cluster
    const centralEntity = findCentralEntity(cluster);
    
    // Generate path from start to central entity
    const path = await generatePath(startEntity, centralEntity);
    
    // Add exploratory branches
    const branches = generateBranches(path, cluster);
    
    paths.push({
      central: centralEntity,
      path,
      branches,
      coherence: calculatePathCoherence(path)
    });
  }
  
  return paths;
}
```

### 10.2. Knowledge Synthesis

```javascript
// Synthesize new knowledge from existing entities
async function synthesizeKnowledge(entityIds, options) {
  const entities = await Promise.all(
    entityIds.map(id => getEntity(id))
  );
  
  // Extract key concepts and properties
  const concepts = extractConcepts(entities);
  const properties = mergeProperties(entities);
  
  // Generate combined embedding
  const combinedEmbedding = generateCombinedEmbedding(
    entities.map(e => e.embedding)
  );
  
  // Generate synthesized entity
  const synthesized = {
    id: generateUUID(),
    type: 'Synthesis',
    name: generateSynthesisName(entities),
    description: generateSynthesisDescription(entities),
    properties: properties,
    sources: entities.map(e => ({
      entityId: e.id,
      contribution: calculateContribution(e, combinedEmbedding),
      retrievedAt: new Date()
    })),
    embedding: combinedEmbedding,
    relations: generateSynthesisRelations(entities),
    metadata: {
      zone: 'extrinsic',
      created: new Date(),
      lastAccessed: new Date(),
      accessCount: 0,
      userTags: [],
      coherenceRank: calculateCoherenceRank(combinedEmbedding),
      stateVector: new Float32Array(options.stateDimensions || 16)
    }
  };
  
  // Store synthesized entity
  await addEntity(synthesized);
  
  return synthesized;
}
```

## 11. Performance Considerations

### 11.1. Embedding Caching

```javascript
// Cache system for embeddings
const embeddingCache = {
  cache: new Map(),
  maxSize: 1000,
  
  get(key) {
    const entry = this.cache.get(key);
    if (entry) {
      entry.lastAccessed = Date.now();
      return entry.embedding;
    }
    return null;
  },
  
  set(key, embedding) {
    // Evict least recently used if at capacity
    if (this.cache.size >= this.maxSize) {
      const lruKey = this.findLRUKey();
      this.cache.delete(lruKey);
    }
    
    this.cache.set(key, {
      embedding,
      lastAccessed: Date.now()
    });
  },
  
  findLRUKey() {
    let oldestTime = Infinity;
    let lruKey = null;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        lruKey = key;
      }
    }
    
    return lruKey;
  }
};
```

### 11.2. Web Worker Implementation

```javascript
// Offload heavy computations to web worker
function initWorker() {
  const worker = new Worker('prime-kg-worker.js');
  
  return {
    generateEmbedding(entity) {
      return new Promise((resolve, reject) => {
        const id = generateUUID();
        
        const handler = (event) => {
          if (event.data.id === id) {
            worker.removeEventListener('message', handler);
            resolve(event.data.embedding);
          }
        };
        
        worker.addEventListener('message', handler);
        
        worker.postMessage({
          task: 'generateEmbedding',
          id,
          entity
        });
      });
    },
    
    calculateCoherence(embeddings) {
      return new Promise((resolve, reject) => {
        const id = generateUUID();
        
        const handler = (event) => {
          if (event.data.id === id) {
            worker.removeEventListener('message', handler);
            resolve(event.data.coherence);
          }
        };
        
        worker.addEventListener('message', handler);
        
        worker.postMessage({
          task: 'calculateCoherence',
          id,
          embeddings
        });
      });
    }
  };
}
```

## 12. Data Migration and Version Upgrades

```javascript
// Database migration
function handleDatabaseUpgrade(db, oldVersion, newVersion, transaction) {
  // Migration paths for different version combinations
  if (oldVersion < 2 && newVersion >= 2) {
    // Upgrade to version 2
    
    // Add new object store
    const configStore = db.createObjectStore('config', { keyPath: 'key' });
    
    // Initialize with default config
    configStore.add({ 
      key: 'defaultConfig',
      value: { /* default config */ }
    });
    
    // Add new index to existing store
    const entityStore = transaction.objectStore('entities');
    entityStore.createIndex('coherenceRank', 'metadata.coherenceRank', { unique: false });
  }
  
  if (oldVersion < 3 && newVersion >= 3) {
    // Upgrade to version 3
    
    // Create vectors store for optimized vector operations
    const vectorStore = db.createObjectStore('vectors', { keyPath: 'entityId' });
    vectorStore.createIndex('zone', 'zone', { unique: false });
    
    // We'll need to populate this store with data from entities
    // This is done after the upgrade in a separate transaction
  }
}

// Post-upgrade data migration
async function migrateData(db, oldVersion, newVersion) {
  if (oldVersion < 3 && newVersion >= 3) {
    // Migrate entity embeddings to vector store
    const entityTx = db.transaction(['entities'], 'readonly');
    const entityStore = entityTx.objectStore('entities');
    
    const vectorTx = db.transaction(['vectors'], 'readwrite');
    const vectorStore = vectorTx.objectStore('vectors');
    
    const entities = await getAllFromStore(entityStore);
    
    for (const entity of entities) {
      vectorStore.add({
        entityId: entity.id,
        zone: entity.metadata.zone,
        baseVector: entity.embedding.baseVector,
        primeVector: entity.embedding.representations.prime,
        semanticVector: entity.embedding.representations.semantic
      });
    }
  }
}
```

## 13. Error Handling and Validation

```javascript
// Error handling
class PKGError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = 'PKGError';
    this.code = code;
    this.details = details;
  }
  
  static DATABASE_ERROR = 'DATABASE_ERROR';
  static ENTITY_NOT_FOUND = 'ENTITY_NOT_FOUND';
  static INVALID_ENTITY = 'INVALID_ENTITY';
  static SEARCH_ERROR = 'SEARCH_ERROR';
  static EMBEDDING_ERROR = 'EMBEDDING_ERROR';
  static EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR';
}

// Entity validation
function validateEntity(entity) {
  // Required fields
  if (!entity.type || !entity.name) {
    throw new PKGError(
      PKGError.INVALID_ENTITY,
      'Entity must have type and name',
      { entity }
    );
  }
  
  // Type validation
  if (typeof entity.name !== 'string' || entity.name.trim() === '') {
    throw new PKGError(
      PKGError.INVALID_ENTITY,
      'Entity name must be a non-empty string',
      { entity }
    );
  }
  
  // Sources validation if present
  if (entity.sources && Array.isArray(entity.sources)) {
    for (const source of entity.sources) {
      if (!source.url) {
        throw new PKGError(
          PKGError.INVALID_ENTITY,
          'Entity sources must have URL',
          { entity, source }
        );
      }
    }
  }
  
  return true;
}
```

## 14. Browser Compatibility and Polyfills

```javascript
// Feature detection and polyfills
function checkCompatibility() {
  const requirements = {
    indexedDB: 'indexedDB' in window,
    arrayBuffer: 'ArrayBuffer' in window,
    promise: 'Promise' in window,
    fetch: 'fetch' in window,
    worker: 'Worker' in window
  };
  
  const missing = Object.entries(requirements)
    .filter(([feature, supported]) => !supported)
    .map(([feature]) => feature);
  
  if (missing.length > 0) {
    throw new PKGError(
      'COMPATIBILITY_ERROR',
      `Your browser is missing required features: ${missing.join(', ')}`,
      { missing }
    );
  }
  
  // Load polyfills if needed
  if (!('TextEncoder' in window)) {
    loadPolyfill('text-encoder-polyfill.js');
  }
  
  return true;
}
```

## 15. Usage Examples

### 15.1. Basic Knowledge Graph Setup

```javascript
// Initialize the knowledge graph
const kg = new PrimeKnowledgeGraph({
  dbName: 'myKnowledgeBase',
  embedDimensions: 128,
  zoneConfig: {
    intrinsicThreshold: 3  // Promote to intrinsic after 3 accesses
  }
});

// Add some initial knowledge
await kg.addEntity({
  type: 'Concept',
  name: 'Prime Framework',
  description: 'A mathematical framework for understanding reality through prime structures',
  properties: {
    field: 'Mathematics',
    year: 2023
  }
}, 'intrinsic');

// Add related entity
const mathId = await kg.addEntity({
  type: 'Topic',
  name: 'Mathematics',
  description: 'The study of numbers, quantities, and shapes'
}, 'intrinsic');

// Create relationship
await kg.createRelationship({
  sourceId: mathId,
  targetId: 'prime-framework',  // ID from first entity
  type: 'includes',
  weight: 0.9
});

// Perform a search
const results = await kg.search('prime number theory');
console.log(`Found ${results.length} results`);
```

### 15.2. Integration with Web Search

```javascript
// Perform an internet search and integrate results
async function searchAndEnrich(query) {
  // Search local knowledge first
  const localResults = await kg.search(query, {
    limit: 5,
    includeZones: ['intrinsic']
  });
  
  // If insufficient local results, search external sources
  if (localResults.length < 3) {
    console.log('Searching external sources...');
    
    // Perform web search
    const webResults = await kg.importFromSource('wikidata', {
      query,
      limit: 5
    });
    
    console.log(`Imported ${webResults.length} entities from external sources`);
    
    // Combine results
    const allResults = [...localResults];
    
    for (const webEntity of webResults) {
      // Calculate coherence with query
      const coherence = await kg.calculateQueryCoherence(query, webEntity.id);
      
      allResults.push({
        ...webEntity,
        score: coherence,
        source: 'external'
      });
    }
    
    // Sort by relevance
    allResults.sort((a, b) => b.score - a.score);
    
    return allResults;
  }
  
  return localResults;
}

// Use the function
const results = await searchAndEnrich('consciousness and prime numbers');
displayResults(results);
```

### 15.3. Knowledge Exploration Interface

```javascript
// Create an exploration interface
async function exploreKnowledge(startEntityId) {
  // Get the entity
  const entity = await kg.getEntity(startEntityId);
  
  // Get related entities
  const related = await kg.findRelated(startEntityId, {
    relationTypes: ['all'],
    maxDistance: 2
  });
  
  // Generate graph data
  const graphData = await kg.generateGraphData({
    centerEntityId: startEntityId,
    maxEntities: 20
  });
  
  // Render graph
  renderGraph(graphData, {
    onNodeClick: (nodeId) => {
      // Update the current entity when a node is clicked
      exploreKnowledge(nodeId);
    }
  });
  
  // Generate insights
  const insights = await kg.generateInsights(startEntityId);
  
  // Display entity details
  displayEntityDetails(entity, insights);
  
  // Display related entities
  displayRelatedEntities(related);
}

// Start exploration from an entity
exploreKnowledge('prime-framework');
```

## 16. Implementation Notes

### 16.1. IndexedDB Optimization

IndexedDB performance can vary significantly across browsers. The following strategies are implemented for optimal performance:

1. **Transaction management** - Minimize transaction count by batching operations
2. **Index usage** - Create indices only for frequently queried fields
3. **Chunking** - Process large datasets in chunks to avoid UI blocking
4. **Compound indices** - Use compound indices for common query patterns
5. **Versioning** - Proper version management for schema migrations

### 16.2. Memory Management

The library implements several memory management strategies:

1. **Lazy loading** - Only load entities when needed
2. **Embedding compression** - Store compressed vector representations
3. **Caching strategy** - LRU cache for frequent entity access
4. **Cleanup routines** - Periodic garbage collection for temporary objects
5. **Streaming** - Stream large result sets rather than loading all at once

### 16.3. Security Considerations

1. **Content sanitization** - All imported content is sanitized before storage
2. **Origin validation** - External API requests are validated against allowlists
3. **Data validation** - Schema validation for all entities before storage
4. **Execution isolation** - Web Workers for processing untrusted content
5. **Privacy controls** - User control over data sharing and export

## 17. Future Extensions

### 17.1. Planned Features

1. **Federated Knowledge Graphs** - Connecting to other instances for distributed knowledge
2. **Time-aware Knowledge** - Versioning and temporal tracking of knowledge evolution
3. **Custom Embedding Models** - User-defined embedding generation
4. **Knowledge Visualization** - Advanced visual representations of knowledge structures
5. **Collaborative Editing** - Multi-user knowledge curation

### 17.2. Integration Points

1. **JSON-LD Export/Import** - Standards-compliant knowledge exchange
2. **REST API** - HTTP interface for programmatic access
3. **WebSocket Interface** - Real-time knowledge updates
4. **Plugin System** - Extensible architecture for custom components
5. **Browser Extension** - Web page knowledge extraction

## 18. Conclusion

The Prime Framework Knowledge Graph Library provides a comprehensive implementation of knowledge management based on the mathematical principles of the Prime Framework. By leveraging advanced embedding techniques derived from the framework's axioms, it offers a unique approach to knowledge representation, search, and discovery.

This JavaScript library can be integrated into any web application to provide intelligent knowledge management with coherence-based relevance, intrinsic/extrinsic knowledge zones, and powerful search capabilities.

## Appendix A: Prime Framework Mathematical Foundation

This library implements several core mathematical concepts from the Prime Framework:

### A.1. Multi-representational Embeddings

Each entity is embedded in multiple mathematical bases, inspired by the Prime Framework's concept of universal embedding:

1. **Binary Basis** - Representation using powers of 2
2. **Prime Basis** - Representation using prime number dimensions
3. **Frequency Basis** - Representation in frequency domain
4. **Semantic Basis** - Representation in meaning space

### A.2. Coherence Inner Product

The coherence between entities is calculated using a specialized inner product operation that measures alignment across multiple representation spaces. This follows the Prime Framework's axiom of coherence optimization.

### A.3. Prime Factorization

The library uses prime factorization patterns as a fundamental structuring principle, reflecting the Prime Framework's unique factorization theorem. Prime factors are extracted from embeddings to identify structural patterns.

### A.4. Reference Manifold Implementation

The knowledge graph itself serves as a discrete approximation of the Prime Framework's continuous reference manifold, with entities as points and relationships as connections in this space.

## Appendix B: Dependencies

The library has minimal dependencies to ensure maximum compatibility:

1. **Core Library** - Zero external dependencies
2. **Optional Visualization** - Dependency on D3.js for graph visualization
3. **Optional Workers** - Support for Comlink for easier Web Worker usage
4. **Optional Compression** - LZMA-JS for embedding compression

All code is ES2020-compatible with appropriate polyfills for older browsers.