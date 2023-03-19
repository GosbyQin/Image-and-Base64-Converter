// 获取页面元素
const fileInput = document.getElementById('file-input');
const imageOutput = document.getElementById('image-output');
const imageUpload = document.getElementById('image-upload');
const base64InputBox = document.getElementById('base64-input-box');
const base64Output = document.getElementById('base64-output');
const convertButton = document.getElementById('convert-button');
const imagePreview = document.getElementById('image-preview');
const imageSize = document.getElementById('image-size');
const textarea = document.getElementById('image-output');

// 监听文件输入框的 change 事件
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file.type.match('image.*')) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      imageOutput.src = reader.result;
      base64Output.src = reader.result;
      base64Output.style.display = 'block';
      if (imagePreview !== null) {
        imagePreview.style.display = 'block';
        imagePreview.src = URL.createObjectURL(file);
      }
      if (imageSize !== null) {
        imageSize.innerHTML = `${(file.size / 1024).toFixed(2)} KB`;
      }
    };
  } else {
    alert('请选择图片文件');
  }
});

// 从 URL 加载图片
imageOutput.addEventListener('input', () => {
  const imageUrl = imageOutput.value;
  if (isValidImageUrl(imageUrl)) {
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl;
    imageUpload.appendChild(imgElement);
  }
});

function isValidImageUrl(url) {
  return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

// 监听粘贴事件
document.addEventListener('paste', (event) => {
  const items = event.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.match('image.*')) {
      const blob = item.getAsFile();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = () => {
        imageOutput.src = reader.result;
        base64Output.src = reader.result;
        base64Output.style.display = 'block';
        if (imagePreview) {
          imagePreview.style.display = 'block';
        }        
        if (imagePreview) {
          imagePreview.src = URL.createObjectURL(blob);
        }
        if (imageSize) {
          imageSize.innerHTML = `${(blob.size / 1024).toFixed(2)} KB`;
        }
      };
    }
  }
});

// 监听转换按钮的点击事件
convertButton.addEventListener('click', () => {
  if (imageOutput.src) {
    const base64 = imageOutput.src.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    base64InputBox.value = base64;
  }

  // 判断是否有输入图片 URL
  const imageUrl = imageOutput.value.trim();
  if (imageUrl) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    // 监听图片加载完成事件
    img.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);

      // 转换为 Base64
      const base64 = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      base64InputBox.value = base64;

      // 显示转换后的图片和原图片
      base64Output.src = `data:image/png;base64,${base64InputBox.value}`;
      base64Output.style.display = 'block';
      imageOutput.src = imageUrl;
      imageOutput.style.display = 'block';

      // 更新图片大小显示
      if (imageSize !== null) {
        imageSize.innerHTML = `${(base64InputBox.value.length * 0.75 / 1024).toFixed(2)} KB`;
      }
    });

    // 监听图片加载失败事件
    img.addEventListener('error', () => {
      console.error('Failed to load image from URL:', imageUrl);
    });
  }

function previewImageFromUrl(url) {
  fetch(url)
    .then(response => response.text())
    .then(data => {
      const base64 = data.split(',')[1];
      imageOutput.src = `data:image/png;base64,${base64}`;
      imageOutput.style.display = 'block';
    })
    .catch(error => {
      console.error('Failed to fetch image from URL:', error);
    });
}

textarea.addEventListener('input', () => {
  const url = textarea.value.trim();
  if (url.startsWith('data:image/')) {
    // If the input is already a Base64 image, just display it
    imageOutput.src = url;
    imageOutput.style.display = 'block';
  } else if (url.startsWith('http')) {
    // If the input is a URL, fetch the image and display it
    previewImageFromUrl(url);
  } else {
    // Otherwise, clear the image preview
    imageOutput.src = '';
    imageOutput.style.display = 'none';
  }
});

  // 如果有输入的 Base64，则将其转换为图片并显示
  if (base64InputBox.value) {
    const img = new Image();
    img.src = `data:image/png;base64,${base64InputBox.value}`;
    img.onload = () => {
      base64Output.src = img.src;
      base64Output.style.display = 'block';
      imageOutput.src = img.src;
      imageOutput.style.display = 'block';
      if (imageSize !== null) {
        imageSize.innerHTML = `${(base64InputBox.value.length * 0.75 / 1024).toFixed(2)} KB`;
      }
    };
  }
});
