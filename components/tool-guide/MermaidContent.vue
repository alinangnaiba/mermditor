<template>
  <div class="space-y-10">
    <div id="basic-flowchart">
      <h3 class="mb-4 text-xl font-medium text-accent-primary">Basic Flowchart</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-surface-secondary p-4">
          <pre class="text-text-secondary">
```mermaid
graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    B -->|No| D[End]
```</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-gray-800 bg-opacity-50 p-4">
          <MermaidRenderer
            :code="`graph TD\n    A[Start] --> B{Is it?}\n    B -->|Yes| C[OK]\n    B -->|No| D[End]`"
          />
        </div>
      </div>
      <p class="mt-2 text-sm text-gray-400">TD = top-down</p>

      <div class="mt-6 grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-gray-800 p-4">
          <pre class="text-gray-300">
```mermaid
graph LR
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    B -->|No| D[End]
```</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-gray-800 bg-opacity-50 p-4">
          <MermaidRenderer
            :code="`graph LR\n    A[Start] --> B{Is it?}\n    B -->|Yes| C[OK]\n    B -->|No| D[End]`"
          />
        </div>
      </div>
      <p class="mt-2 text-sm text-gray-400">LR = left-right</p>

      <div class="mt-6 grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-gray-800 p-4">
          <pre class="text-gray-300">
```mermaid
graph RL
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    B -->|No| D[End]
```</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-gray-800 bg-opacity-50 p-4">
          <MermaidRenderer
            :code="`graph RL\n    A[Start] --> B{Is it?}\n    B -->|Yes| C[OK]\n    B -->|No| D[End]`"
          />
        </div>
      </div>
      <p class="mt-2 text-sm text-gray-400">RL = right-left</p>

      <div class="mt-6 grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-gray-800 p-4">
          <pre class="text-gray-300">
```mermaid
graph BT
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    B -->|No| D[End]
```</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-gray-800 bg-opacity-50 p-4">
          <MermaidRenderer
            :code="`graph BT\n    A[Start] --> B{Is it?}\n    B -->|Yes| C[OK]\n    B -->|No| D[End]`"
          />
        </div>
      </div>
      <p class="mt-2 text-sm text-gray-400">BT = bottom-top</p>
    </div>

    <div id="node-shapes">
      <h3 class="mb-4 text-xl font-medium text-blue-400">Node Shapes</h3>

      <div id="node-shape-square" class="mb-5">
        <h4 class="mb-3 text-lg font-medium text-blue-300">Square Node</h4>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-lg bg-gray-800 p-4">
            <pre class="text-gray-300">
```mermaid
graph TD
    A[Square Node]
```</pre
            >
          </div>
          <div class="rounded-lg bg-gray-800 bg-opacity-50 p-4">
            <MermaidRenderer :code="`graph TD\n    A[Square Node]`" />
            <div class="mt-2 text-sm text-gray-500">Square brackets [Text] for square node</div>
          </div>
        </div>
      </div>

      <div id="node-shape-rounded" class="mb-5">
        <h4 class="mb-3 text-lg font-medium text-blue-300">Rounded Node</h4>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-lg bg-gray-800 p-4">
            <pre class="text-gray-300">
```mermaid
graph TD
    B(Rounded Node)
```</pre
            >
          </div>
          <div class="rounded-lg bg-gray-800 bg-opacity-50 p-4">
            <MermaidRenderer :code="`graph TD\n    B(Rounded Node)`" />
            <div class="mt-2 text-sm text-gray-500">Parentheses (Text) for rounded node</div>
          </div>
        </div>
      </div>

      <div id="node-shape-stadium" class="mb-5">
        <h4 class="mb-3 text-lg font-medium text-blue-300">Stadium Node</h4>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-lg bg-gray-800 p-4">
            <pre class="text-gray-300">
```mermaid
graph TD
    C([Stadium Node])
```</pre
            >
          </div>
          <div class="rounded-lg bg-gray-800 bg-opacity-50 p-4">
            <MermaidRenderer :code="`graph TD\n    C([Stadium Node])`" />
            <div class="mt-2 text-sm text-gray-500">([Text]) for stadium-shaped node</div>
          </div>
        </div>
      </div>

      <div id="node-shape-subroutine" class="mb-5">
        <h4 class="mb-3 text-lg font-medium text-blue-300">Subroutine Node</h4>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-lg bg-gray-800 p-4">
            <pre class="text-gray-300">
```mermaid
graph TD
    D[[Subroutine Node]]
```</pre
            >
          </div>
          <div class="rounded-lg bg-gray-800 bg-opacity-50 p-4">
            <MermaidRenderer :code="`graph TD\n    D[[Subroutine Node]]`" />
            <div class="mt-2 text-sm text-gray-500">[[Text]] for subroutine node</div>
          </div>
        </div>
      </div>

      <div id="node-shape-database" class="mb-5">
        <h4 class="mb-3 text-lg font-medium text-blue-300">Database Node</h4>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-lg bg-gray-800 p-4">
            <pre class="text-gray-300">
```mermaid
graph TD
    E[(Database Node)]
```</pre
            >
          </div>
          <div class="rounded-lg bg-gray-800 bg-opacity-50 p-4">
            <MermaidRenderer :code="`graph TD\n    E[(Database Node)]`" />
            <div class="mt-2 text-sm text-gray-500">[(Text)] for database node</div>
          </div>
        </div>
      </div>

      <div id="node-shape-circle" class="mb-5">
        <h4 class="mb-3 text-lg font-medium text-blue-300">Circle Node</h4>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-lg bg-gray-800 p-4">
            <pre class="text-gray-300">
```mermaid
graph TD
    F((Circle Node))
```</pre
            >
          </div>
          <div class="rounded-lg bg-gray-800 bg-opacity-50 p-4">
            <MermaidRenderer :code="`graph TD\n    F((Circle Node))`" />
            <div class="mt-2 text-sm text-gray-500">((Text)) for circle node</div>
          </div>
        </div>
      </div>

      <div id="node-shape-asymmetric" class="mb-5">
        <h4 class="mb-3 text-lg font-medium text-blue-300">Asymmetric Node</h4>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-lg bg-gray-800 p-4">
            <pre class="text-gray-300">
```mermaid
graph TD
    G>Asymmetric Node]
```</pre
            >
          </div>
          <div class="rounded-lg bg-gray-800 bg-opacity-50 p-4">
            <MermaidRenderer :code="`graph TD\n    G>Asymmetric Node]`" />
            <div class="mt-2 text-sm text-gray-500">>Text] for asymmetric node</div>
          </div>
        </div>
      </div>

      <div id="node-shape-rhombus" class="mb-5">
        <h4 class="mb-3 text-lg font-medium text-blue-300">Rhombus Node</h4>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-lg bg-gray-800 p-4">
            <pre class="text-gray-300">
```mermaid
graph TD
    H{Rhombus Node}
```</pre
            >
          </div>
          <div class="rounded-lg bg-gray-800 bg-opacity-50 p-4">
            <MermaidRenderer :code="`graph TD\n    H{Rhombus Node}`" />
            <div class="mt-2 text-sm text-gray-500">{Text} for rhombus/diamond node</div>
          </div>
        </div>
      </div>

      <div id="node-shape-parallelogram" class="mb-5">
        <h4 class="mb-3 text-lg font-medium text-blue-300">Parallelogram</h4>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-lg bg-gray-800 p-4">
            <pre class="text-gray-300">
```mermaid
graph TD
    J[/Parallelogram/]
```</pre
            >
          </div>
          <div class="rounded-lg bg-gray-800 bg-opacity-50 p-4">
            <MermaidRenderer :code="`graph TD\n    J[/Parallelogram/]`" />
            <div class="mt-2 text-sm text-gray-500">[/Text/] for parallelogram</div>
          </div>
        </div>
      </div>

      <div id="node-shape-alt-parallelogram" class="mb-5">
        <h4 class="mb-3 text-lg font-medium text-blue-300">Alternative Parallelogram</h4>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-lg bg-gray-800 p-4">
            <pre class="text-gray-300">
```mermaid
graph TD
    K[\Parallelogram alt\]
```</pre
            >
          </div>
          <div class="rounded-lg bg-gray-800 bg-opacity-50 p-4">
            <MermaidRenderer :code="`graph TD\n    K[\Parallelogram alt\]`" />
            <div class="mt-2 text-sm text-gray-500">[\Text\] for alternative parallelogram</div>
          </div>
        </div>
      </div>

      <div id="node-shape-trapezoid" class="mb-5">
        <h4 class="mb-3 text-lg font-medium text-blue-300">Trapezoid</h4>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-lg bg-gray-800 p-4">
            <pre class="text-gray-300">
```mermaid
graph TD
    L[/Trapezoid\]
```</pre
            >
          </div>
          <div class="rounded-lg bg-gray-800 bg-opacity-50 p-4">
            <MermaidRenderer :code="`graph TD\n    L[\/Trapezoid\\]`" />
            <div class="mt-2 text-sm text-gray-500">[/Text\] for trapezoid</div>
          </div>
        </div>
      </div>

      <div id="node-shape-alt-trapezoid" class="mb-5">
        <h4 class="mb-3 text-lg font-medium text-blue-300">Alternative Trapezoid</h4>
        <div class="grid gap-6 md:grid-cols-2">
          <div class="rounded-lg bg-gray-800 p-4">
            <pre class="text-gray-300">
```mermaid
graph TD
    M[\Trapezoid alt/]
```</pre
            >
          </div>
          <div class="rounded-lg bg-gray-800 bg-opacity-50 p-4">
            <MermaidRenderer :code="`graph TD\n    M[\\Trapezoid alt\/]`" />
            <div class="mt-2 text-sm text-gray-500">[\Text/] for alternative trapezoid</div>
          </div>
        </div>
      </div>
    </div>

    <div id="sequence-diagram">
      <h3 class="mb-4 text-xl font-medium text-blue-400">Sequence Diagram</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-gray-800 p-4">
          <pre class="text-gray-300">
```mermaid
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>Bob: Hello Bob, how are you?
    Bob-->>Alice: I am good thanks!
    Alice->>Bob: Great!
```</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-gray-800 bg-opacity-50 p-4">
          <MermaidRenderer
            :code="`sequenceDiagram\n    participant Alice\n    participant Bob\n    Alice->>Bob: Hello Bob, how are you?\n    Bob-->>Alice: I am good thanks!\n    Alice->>Bob: Great!`"
          />
        </div>
      </div>
    </div>

    <div id="class-diagram">
      <h3 class="mb-4 text-xl font-medium text-blue-400">Class Diagram</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-gray-800 p-4">
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
```</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-gray-800 bg-opacity-50 p-4">
          <MermaidRenderer
            :code="`classDiagram\n    Animal <|-- Duck\n    Animal <|-- Fish\n    Animal <|-- Zebra\n    Animal : +int age\n    Animal : +String gender\n    Animal: +isMammal()\n    Animal: +mate()\n    class Duck{\n      +String beakColor\n      +swim()\n      +quack()\n    }`"
          />
        </div>
      </div>
    </div>

    <div id="state-diagram">
      <h3 class="mb-4 text-xl font-medium text-blue-400">State Diagram</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-gray-800 p-4">
          <pre class="text-gray-300">
```mermaid
stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]
```</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-gray-800 bg-opacity-50 p-4">
          <MermaidRenderer
            :code="`stateDiagram-v2\n    [*] --> Still\n    Still --> [*]\n    Still --> Moving\n    Moving --> Still\n    Moving --> Crash\n    Crash --> [*]`"
          />
        </div>
      </div>
    </div>

    <div id="gantt-chart">
      <h3 class="mb-4 text-xl font-medium text-blue-400">Gantt Chart</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-gray-800 p-4">
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
```</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-gray-800 bg-opacity-50 p-4">
          <MermaidRenderer
            :code="`gantt\n    title Project Timeline\n    dateFormat  YYYY-MM-DD\n    section Planning\n    Design           :a1, 2023-01-01, 30d\n    section Development\n    Implementation   :a2, after a1, 45d\n    Testing          :a3, after a2, 20d`"
          />
        </div>
      </div>
    </div>

    <div id="entity-relationship">
      <h3 class="mb-4 text-xl font-medium text-blue-400">Entity Relationship</h3>
      <div class="grid gap-6 md:grid-cols-2">
        <div class="mb-2 rounded-lg bg-gray-800 p-4">
          <pre class="text-gray-300">
```mermaid
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
```</pre
          >
        </div>
        <div class="mb-2 rounded-lg bg-gray-800 bg-opacity-50 p-4">
          <MermaidRenderer
            :code="`erDiagram\n    CUSTOMER ||--o{ ORDER : places\n    ORDER ||--|{ LINE-ITEM : contains\n    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// MermaidRenderer component is auto-imported by Nuxt
// This component displays Mermaid syntax examples.
// It relies on the MermaidRenderer component to render the diagrams
</script>
