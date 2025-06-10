---
base_model:
- google/gemma-3-4b-it
license: gemma
pipeline_tag: text-generation
library_name: transformers
---

# Gemma-3-4b Text-Only

This model is a text-only version of [google/gemma-3-4b-it](https://huggingface.co/google/gemma-3-4b-it), converted from the multimodal Gemma3ForConditionalGeneration architecture to the text-only Gemma3ForCausalLM architecture.

## Model Description

- **Original Model**: The original Gemma-3-4b-it is a multimodal model released by Google that can process both text and images
- **This Version**: This version has been modified to use the same architecture as the text-only 1b model, with the vision components removed
- **Parameters**: 4 billion parameters
- **Conversion Process**: Vision-related components were stripped while maintaining the text generation capabilities

## Usage

You can load and use this model the same way you would use the text-only [google/gemma-3-1b-it](https://huggingface.co/google/gemma-3-1b-it) version:

```python
from transformers import AutoTokenizer, BitsAndBytesConfig, Gemma3ForCausalLM
import torch

model_id = "gghfez/gemma-3-4b-novision"

quantization_config = BitsAndBytesConfig(load_in_8bit=True)

model = Gemma3ForCausalLM.from_pretrained(
    model_id, quantization_config=quantization_config
).eval()

tokenizer = AutoTokenizer.from_pretrained(model_id)

messages = [
    [
        {
            "role": "system",
            "content": [{"type": "text", "text": "You are a helpful assistant."},]
        },
        {
            "role": "user",
            "content": [{"type": "text", "text": "Write a poem on Hugging Face, the company"},]
        },
    ],
]
inputs = tokenizer.apply_chat_template(
    messages,
    add_generation_prompt=True,
    tokenize=True,
    return_dict=True,
    return_tensors="pt",
).to(model.device).to(torch.bfloat16)


with torch.inference_mode():
    outputs = model.generate(**inputs, max_new_tokens=64)

outputs = tokenizer.batch_decode(outputs)
```

