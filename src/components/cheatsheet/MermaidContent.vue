<template>
  <div class="space-y-10">
    <div>
      <h3 class="text-xl font-medium mb-4 text-blue-400">Basic Flowchart</h3>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-gray-800 rounded-lg p-4 mb-2">
          <pre class="text-gray-300">
```mermaid
graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    B -->|No| D[End]
```</pre>
        </div>
        <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
          <MermaidRenderer :code="`graph TD\n    A[Start] --> B{Is it?}\n    B -->|Yes| C[OK]\n    B -->|No| D[End]`" />
        </div>
      </div>
      <p class="text-sm text-gray-400 mt-2">TD = top-down, LR = left-right</p>
    </div>
      <div>
      <h3 class="text-xl font-medium mb-4 text-blue-400">Node Shapes</h3>
      
      <div class="mb-5">
        <h4 class="text-lg font-medium mb-3 text-blue-300">Square Node</h4>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-800 rounded-lg p-4">
            <pre class="text-gray-300">```mermaid
graph TD
    A[Square Node]
```</pre>
          </div>
          <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
            <MermaidRenderer :code="`graph TD\n    A[Square Node]`" />
            <div class="text-sm text-gray-500 mt-2">Square brackets [Text] for square node</div>
          </div>
        </div>
      </div>
      
      <div class="mb-5">
        <h4 class="text-lg font-medium mb-3 text-blue-300">Rounded Node</h4>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-800 rounded-lg p-4">
            <pre class="text-gray-300">```mermaid
graph TD
    B(Rounded Node)
```</pre>
          </div>
          <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
            <MermaidRenderer :code="`graph TD\n    B(Rounded Node)`" />
            <div class="text-sm text-gray-500 mt-2">Parentheses (Text) for rounded node</div>
          </div>
        </div>
      </div>
      
      <div class="mb-5">
        <h4 class="text-lg font-medium mb-3 text-blue-300">Stadium Node</h4>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-800 rounded-lg p-4">
            <pre class="text-gray-300">```mermaid
graph TD
    C([Stadium Node])
```</pre>
          </div>
          <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
            <MermaidRenderer :code="`graph TD\n    C([Stadium Node])`" />
            <div class="text-sm text-gray-500 mt-2">([Text]) for stadium-shaped node</div>
          </div>
        </div>
      </div>
      
      <div class="mb-5">
        <h4 class="text-lg font-medium mb-3 text-blue-300">Subroutine Node</h4>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-800 rounded-lg p-4">
            <pre class="text-gray-300">```mermaid
graph TD
    D[[Subroutine Node]]
```</pre>
          </div>
          <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
            <MermaidRenderer :code="`graph TD\n    D[[Subroutine Node]]`" />
            <div class="text-sm text-gray-500 mt-2">[[Text]] for subroutine node</div>
          </div>
        </div>
      </div>
      
      <div class="mb-5">
        <h4 class="text-lg font-medium mb-3 text-blue-300">Database Node</h4>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-800 rounded-lg p-4">
            <pre class="text-gray-300">```mermaid
graph TD
    E[(Database Node)]
```</pre>
          </div>
          <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
            <MermaidRenderer :code="`graph TD\n    E[(Database Node)]`" />
            <div class="text-sm text-gray-500 mt-2">[(Text)] for database node</div>
          </div>
        </div>
      </div>
      
      <div class="mb-5">
        <h4 class="text-lg font-medium mb-3 text-blue-300">Circle Node</h4>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-800 rounded-lg p-4">
            <pre class="text-gray-300">```mermaid
graph TD
    F((Circle Node))
```</pre>
          </div>
          <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
            <MermaidRenderer :code="`graph TD\n    F((Circle Node))`" />
            <div class="text-sm text-gray-500 mt-2">((Text)) for circle node</div>
          </div>
        </div>
      </div>
      
      <div class="mb-5">
        <h4 class="text-lg font-medium mb-3 text-blue-300">Asymmetric Node</h4>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-800 rounded-lg p-4">
            <pre class="text-gray-300">```mermaid
graph TD
    G>Asymmetric Node]
```</pre>
          </div>
          <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
            <MermaidRenderer :code="`graph TD\n    G>Asymmetric Node]`" />
            <div class="text-sm text-gray-500 mt-2">>Text] for asymmetric node</div>
          </div>
        </div>
      </div>
      
      <div class="mb-5">
        <h4 class="text-lg font-medium mb-3 text-blue-300">Rhombus Node</h4>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-800 rounded-lg p-4">
            <pre class="text-gray-300">```mermaid
graph TD
    H{Rhombus Node}
```</pre>
          </div>
          <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
            <MermaidRenderer :code="`graph TD\n    H{Rhombus Node}`" />
            <div class="text-sm text-gray-500 mt-2">{Text} for rhombus/diamond node</div>
          </div>
        </div>
      </div>
      
      <div class="mb-5">
        <h4 class="text-lg font-medium mb-3 text-blue-300">Parallelogram</h4>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-800 rounded-lg p-4">
            <pre class="text-gray-300">```mermaid
graph TD
    J[/Parallelogram/]
```</pre>
          </div>
          <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
            <MermaidRenderer :code="`graph TD\n    J[/Parallelogram/]`" />
            <div class="text-sm text-gray-500 mt-2">[/Text/] for parallelogram</div>
          </div>
        </div>
      </div>
      
      <div class="mb-5">
        <h4 class="text-lg font-medium mb-3 text-blue-300">Alternative Parallelogram</h4>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-800 rounded-lg p-4">
            <pre class="text-gray-300">```mermaid
graph TD
    K[\Parallelogram alt\]
```</pre>
          </div>
          <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
            <MermaidRenderer :code="`graph TD\n    K[\Parallelogram alt\]`" />
            <div class="text-sm text-gray-500 mt-2">[\Text\] for alternative parallelogram</div>
          </div>
        </div>
      </div>
      
      <div class="mb-5">
        <h4 class="text-lg font-medium mb-3 text-blue-300">Trapezoid</h4>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-800 rounded-lg p-4">
            <pre class="text-gray-300">```mermaid
graph TD
    L[/Trapezoid\]
```</pre>
          </div>
          <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
            <MermaidRenderer :code="`graph TD\n    L[\/Trapezoid\\]`" />
            <div class="text-sm text-gray-500 mt-2">[/Text\] for trapezoid</div>
          </div>
        </div>
      </div>
      
      <div class="mb-5">
        <h4 class="text-lg font-medium mb-3 text-blue-300">Alternative Trapezoid</h4>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="bg-gray-800 rounded-lg p-4">
            <pre class="text-gray-300">```mermaid
graph TD
    M[\Trapezoid alt/]
```</pre>
          </div>
          <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4">
            <MermaidRenderer :code="`graph TD\n    M[\\Trapezoid alt\/]`" />
            <div class="text-sm text-gray-500 mt-2">[\Text/] for alternative trapezoid</div>
          </div>
        </div>
      </div>
    </div>
    
    <div>
      <h3 class="text-xl font-medium mb-4 text-blue-400">Sequence Diagram</h3>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-gray-800 rounded-lg p-4 mb-2">
          <pre class="text-gray-300">
```mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I am good thanks!
    Alice->>Bob: Great!
```</pre>
        </div>
        <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
          <MermaidRenderer :code="`sequenceDiagram\n    participant Alice\n    participant Bob\n    Alice->>Bob: Hello Bob, how are you?\n    Bob-->>Alice: I am good thanks!\n    Alice->>Bob: Great!`" />
        </div>
      </div>
    </div>
    
    <div>
      <h3 class="text-xl font-medium mb-4 text-blue-400">Class Diagram</h3>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-gray-800 rounded-lg p-4 mb-2">
          <pre class="text-gray-300">
```mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
      +String beakColor
      +swim()
      +quack()
    }
```</pre>
        </div>
        <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
          <MermaidRenderer :code="`classDiagram\n    Animal <|-- Duck\n    Animal <|-- Fish\n    Animal <|-- Zebra\n    Animal : +int age\n    Animal : +String gender\n    Animal: +isMammal()\n    Animal: +mate()\n    class Duck{\n      +String beakColor\n      +swim()\n      +quack()\n    }`" />
        </div>
      </div>
    </div>
    
    <div>
      <h3 class="text-xl font-medium mb-4 text-blue-400">State Diagram</h3>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-gray-800 rounded-lg p-4 mb-2">
          <pre class="text-gray-300">
```mermaid
stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
```</pre>
        </div>
        <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
          <MermaidRenderer :code="`stateDiagram-v2\n    [*] --> Still\n    Still --> [*]\n    Still --> Moving\n    Moving --> Still\n    Moving --> Crash\n    Crash --> [*]`" />
        </div>
      </div>
    </div>
    
    <div>
      <h3 class="text-xl font-medium mb-4 text-blue-400">Gantt Chart</h3>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-gray-800 rounded-lg p-4 mb-2">
          <pre class="text-gray-300">
```mermaid
gantt
    title Project Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Design           :a1, 2023-01-01, 30d
    section Development
    Implementation   :a2, after a1, 45d
    Testing          :a3, after a2, 20d
```</pre>
        </div>
        <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
          <MermaidRenderer :code="`gantt\n    title Project Timeline\n    dateFormat  YYYY-MM-DD\n    section Planning\n    Design           :a1, 2023-01-01, 30d\n    section Development\n    Implementation   :a2, after a1, 45d\n    Testing          :a3, after a2, 20d`" />
        </div>
      </div>
    </div>
    
    <div>
      <h3 class="text-xl font-medium mb-4 text-blue-400">Entity Relationship</h3>
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-gray-800 rounded-lg p-4 mb-2">
          <pre class="text-gray-300">
```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
```</pre>
        </div>
        <div class="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-2">
          <MermaidRenderer :code="`erDiagram\n    CUSTOMER ||--o{ ORDER : places\n    ORDER ||--|{ LINE-ITEM : contains\n    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MermaidRenderer from '@/components/MermaidRenderer.vue';

// This component displays Mermaid syntax examples.
// It relies on the MermaidRenderer component to render the diagrams.
</script>
