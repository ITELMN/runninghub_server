// ComfyUI workflow template based on lmage_api.json
export const workflowTemplate = {
  "3": {
    "inputs": {
      "text": "{{prompt}}"
    },
    "class_type": "Textbox",
    "_meta": {
      "title": "Textbox"
    }
  },
  "4": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": ["45", 0]
    },
    "class_type": "SaveImage",
    "_meta": {
      "title": "Save Image"
    }
  },
  "5": {
    "inputs": {
      "text": "{{negative_prompt}}"
    },
    "class_type": "Textbox",
    "_meta": {
      "title": "Textbox"
    }
  },
  "33": {
    "inputs": {
      "select": 1,
      "sel_mode": false,
      "input1": ["3", 0]
    },
    "class_type": "ImpactSwitch",
    "_meta": {
      "title": "Switch (Any)"
    }
  },
  "37": {
    "inputs": {
      "unet_name": "qwen_image_fp8_e4m3fn.safetensors",
      "weight_dtype": "fp8_e4m3fn"
    },
    "class_type": "UNETLoader",
    "_meta": {
      "title": "Load Diffusion Model"
    }
  },
  "39": {
    "inputs": {
      "shift": 3.5,
      "model": ["37", 0]
    },
    "class_type": "ModelSamplingAuraFlow",
    "_meta": {
      "title": "ModelSamplingAuraFlow"
    }
  },
  "40": {
    "inputs": {
      "seed": "{{seed}}",
      "steps": "{{steps}}",
      "cfg": "{{cfg_scale}}",
      "sampler_name": "euler",
      "scheduler": "simple",
      "denoise": 1,
      "model": ["39", 0],
      "positive": ["42", 0],
      "negative": ["43", 0],
      "latent_image": ["44", 0]
    },
    "class_type": "KSampler",
    "_meta": {
      "title": "KSampler"
    }
  },
  "42": {
    "inputs": {
      "text": ["47", 0],
      "clip": ["56", 0]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
  "43": {
    "inputs": {
      "text": ["5", 0],
      "clip": ["56", 0]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
  "44": {
    "inputs": {
      "width": ["53", 0],
      "height": ["53", 1],
      "batch_size": ["54", 2]
    },
    "class_type": "EmptyLatentImage",
    "_meta": {
      "title": "Empty Latent Image"
    }
  },
  "45": {
    "inputs": {
      "samples": ["40", 0],
      "vae": ["46", 0]
    },
    "class_type": "VAEDecode",
    "_meta": {
      "title": "VAE Decode"
    }
  },
  "46": {
    "inputs": {
      "vae_name": "qwen_image_vae.safetensors"
    },
    "class_type": "VAELoader",
    "_meta": {
      "title": "Load VAE"
    }
  },
  "47": {
    "inputs": {
      "text": "{{prompt}}",
      "anything": ["33", 0]
    },
    "class_type": "easy showAnything",
    "_meta": {
      "title": "Show Any"
    }
  },
  "53": {
    "inputs": {
      "width": "{{width}}",
      "height": "{{height}}",
      "aspect_ratio": "{{aspect_ratio}}",
      "swap_dimensions": "Off",
      "upscale_factor": 1,
      "batch_size": "{{batch_size}}"
    },
    "class_type": "CR SDXL Aspect Ratio",
    "_meta": {
      "title": "🔳 CR SDXL Aspect Ratio"
    }
  },
  "54": {
    "inputs": {
      "select": 1,
      "sel_mode": false,
      "input1": ["55", 0],
      "input2": ["55", 0],
      "input3": ["55", 0],
      "input4": ["55", 0]
    },
    "class_type": "ImpactSwitch",
    "_meta": {
      "title": "Switch (Any)"
    }
  },
  "55": {
    "inputs": {
      "value": "{{batch_size}}"
    },
    "class_type": "Int",
    "_meta": {
      "title": "Int"
    }
  },
  "56": {
    "inputs": {
      "clip_name": "qwen_2.5_vl_7b_fp8_scaled.safetensors",
      "type": "qwen_image",
      "device": "default"
    },
    "class_type": "CLIPLoader",
    "_meta": {
      "title": "Load CLIP"
    }
  }
};

// Node IDs for parameter modification
export const nodeIds = {
  PROMPT: "3",  // Textbox node - main prompt input
  PROMPT_SHOW: "47",  // Show Any node - also needs to be updated
  NEGATIVE_PROMPT: "5",
  KSAMPLER: "40",
  ASPECT_RATIO: "53",
  BATCH_SIZE: "55"
};
