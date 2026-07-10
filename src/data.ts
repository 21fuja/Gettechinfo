import { Lesson } from "./types";

export const prebuiltLessons: Lesson[] = [
  {
    topic: "Neural Networks (How AI Learns)",
    overview: "Explore how multi-layered neural networks process data, calculate errors, and update connections to learn like a biological brain.",
    slides: [
      {
        title: "What is a Neural Network?",
        script: "A neural network is an AI model inspired by the human brain. It consists of layers of interconnected nodes that process information to make decisions, learning patterns from raw data.",
        content: [
          "Inspired by biological networks of biological neurons.",
          "Processes incoming raw data through layers of connections.",
          "Transforms raw features into accurate predictions."
        ],
        visualType: "neural_network",
        visualConfig: {
          layers: [3, 5, 2],
          animateWeights: true
        }
      },
      {
        title: "The Forward Pass (Prediction)",
        script: "During the forward pass, data travels forward through the layers. Each connection has a specific weight that scales the signal, and nodes apply an activation function to generate the final prediction.",
        content: [
          "Weights determine connection strength between nodes.",
          "Nodes sum all incoming inputs and apply mathematical activations.",
          "Propagates computations to output layers to make predictions."
        ],
        visualType: "neural_network",
        visualConfig: {
          layers: [3, 5, 2],
          animateWeights: true
        }
      },
      {
        title: "Evaluating Loss (Finding Errors)",
        script: "We calculate how far off the prediction is using a Loss Function. The goal of AI training is to slide down this mathematical error curve using Gradient Descent to reach the lowest possible error.",
        content: [
          "Loss represents the exact penalty score of prediction error.",
          "Gradient Descent acts as a compass pointing downhill toward low error.",
          "Iterative updates slide down the curve to optimize accuracy."
        ],
        visualType: "graph_plot",
        visualConfig: {
          title: "Gradient Descent Optimization",
          xAxis: "Training Epochs",
          yAxis: "Error Rate (Loss Value)",
          curve: "downward"
        }
      },
      {
        title: "Backpropagation (Adjusting Weights)",
        script: "Finally, Backpropagation sends the error backwards through the network. It calculates how each weight contributed to the mistake, and nudges them slightly to improve the next prediction.",
        content: [
          "Propagates the computed output error backwards layer-by-layer.",
          "Computes mathematical gradients of loss with respect to weights.",
          "Nudges connections systematically to ensure learning occurs."
        ],
        visualType: "neural_network",
        visualConfig: {
          layers: [3, 5, 2],
          animateWeights: true
        }
      }
    ]
  },
  {
    topic: "Computer Vision (How AI Sees)",
    overview: "Learn how Convolutional Neural Networks (CNNs) process pixel matrices, apply sliding filters, and recognize complex structures.",
    slides: [
      {
        title: "Pixels to Patterns",
        script: "Computers do not see images the way humans do. To an AI, an image is a massive grid of numbers representing the brightness values of individual pixels across different color channels.",
        content: [
          "Images are represented as numeric pixel intensity matrices.",
          "Values typically range from 0 (pure black) to 255 (pure white).",
          "AI scans these numeric grids to search for abstract patterns."
        ],
        visualType: "grid_scanner",
        visualConfig: {
          label: "Input Image Pixel Grid",
          size: 8
        }
      },
      {
        title: "Scanning with Filters (Kernels)",
        script: "A Convolutional Neural Network scans the pixel grid using small matrices called kernels or filters. This filter slides across the image, highlighting features like vertical or horizontal edges.",
        content: [
          "Small filter matrices scan sub-regions of pixels.",
          "Computes dot-products to extract localized feature mappings.",
          "Highlights edges, borders, textures, and lines."
        ],
        visualType: "grid_scanner",
        visualConfig: {
          label: "3x3 Scanning Convolution Filter",
          size: 8
        }
      },
      {
        title: "Hierarchical Feature Maps",
        script: "As data travels deeper into the network, simple features are combined into complex hierarchies. First, the AI finds edges; then, it assembles them into textures, shapes, and finally full faces or objects.",
        content: [
          "Early layers detect raw edges, lines, and simple borders.",
          "Middle layers assemble edge signals into textures and corners.",
          "Deep layers detect high-level semantic shapes and complete objects."
        ],
        visualType: "block_diagram",
        visualConfig: {
          blocks: ["Raw Pixel Inputs", "Edge & Line Filters", "Shape & Texture Parts", "Full Object Classifier"],
          highlightIndex: 1
        }
      },
      {
        title: "Classification Decisions",
        script: "At the final output layer, the network pools all high-level shapes detected and feeds them to a classification layer. This calculates probability scores for target labels, choosing the most confident classification.",
        content: [
          "Transforms abstract shape matrices into semantic features.",
          "Calculates probability distributions for target labels.",
          "Accurately classifies visual inputs with human-like speed."
        ],
        visualType: "comparison_matrix",
        visualConfig: {
          headers: ["Object Label", "Confidence Score", "Verification Outcome"],
          rows: [
            ["Domestic Cat", "93.4%", "Match Found"],
            ["Golden Retriever", "4.2%", "Ignored"],
            ["Spotted Jaguar", "2.4%", "Ignored"]
          ]
        }
      }
    ]
  },
  {
    topic: "Language Models (How AI Reads & Writes)",
    overview: "Understand how Large Language Models split text into tokens, use attention weights to understand context, and predict the next words.",
    slides: [
      {
        title: "Understanding Words as Numbers",
        script: "Large Language Models process text by dividing words or sub-words into smaller pieces called tokens. It maps these tokens to high-dimensional vectors, letting words with similar meanings sit close together.",
        content: [
          "Splits raw text strings into numeric Token representations.",
          "Transforms tokens into multi-dimensional Vector Embeddings.",
          "Stores mathematical relationships of words in semantic vector spaces."
        ],
        visualType: "block_diagram",
        visualConfig: {
          blocks: ["Input Text", "Tokenizer", "Semantic Embeddings", "Transformer Encoder"],
          highlightIndex: 1
        }
      },
      {
        title: "The Self-Attention Mechanism",
        script: "The revolutionary Self-Attention mechanism allows the model to calculate context weights between all words in a sentence, resolving pronouns and understanding complex grammar in a single step.",
        content: [
          "Evaluates mutual relationships between all words in a sentence.",
          "Resolves pronoun references by linking subjects to context.",
          "Processes full text sequences concurrently with immense speed."
        ],
        visualType: "comparison_matrix",
        visualConfig: {
          headers: ["Subject Word", "Context Link", "Attention Strength"],
          rows: [
            ["'The Robot'", "linked to: 'Itself'", "Excellent (0.89)"],
            ["'The Robot'", "linked to: 'Heavy Metal'", "Moderate (0.41)"],
            ["'The Robot'", "linked to: 'An'", "Negligible (0.02)"]
          ]
        }
      },
      {
        title: "Next Token Probability",
        script: "Language Models generate text by calculating a probability distribution of the next word across their entire vocabulary. It doesn't plan ideas; it calculates the mathematically most likely next step.",
        content: [
          "Computes high-dimensional logits for entire vocabulary sets.",
          "Applies Softmax functions to produce clean probability scores.",
          "Balances accuracy with temperature configurations to permit creativity."
        ],
        visualType: "graph_plot",
        visualConfig: {
          title: "Vocabulary Logits",
          xAxis: "Token Vocabulary Index",
          yAxis: "Probability Weight",
          curve: "scatter"
        }
      },
      {
        title: "Autoregressive Generation Loop",
        script: "Once the AI selects the next word, it appends it to the existing sentence and feeds it back into the model as input. This continuous loop generates coherent paragraphs of readable text.",
        content: [
          "Appends newly predicted tokens to active prompt buffers.",
          "Executes the text generation process iteratively.",
          "Produces human-quality text in seconds."
        ],
        visualType: "block_diagram",
        visualConfig: {
          blocks: ["Initial Prompt", "Predict Word", "Feed-forward Update", "Output Paragraph"],
          highlightIndex: 3
        }
      }
    ]
  }
];
