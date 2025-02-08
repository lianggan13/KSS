## Android

### RelativeLayout

```xml
android:layout_below="@id/another_view"

android:layout_above="@id/another_view"

android:layout_toRightOf="@id/another_view"

android:layout_toLeftOf="@id/another_view"

android:layout_alignParentTop="true"

android:layout_alignParentBottom="true"

android:layout_alignParentLeft="true"

android:layout_alignParentRight="true"

android:layout_centerInParent="true"

android:layout_centerHorizontal="true"

android:layout_centerVertical="true"
```


### Thread

```java
 runOnUiThread(() -> contentTv.setText(e.getMessage()));
```

### Animation

#### 线性动画

```xml
<?xml version="1.0" encoding="utf-8"?>  
<set xmlns:android="http://schemas.android.com/apk/res/android"  
    android:duration="3000">  
    <translate  
        android:fromXDelta="0"  
        android:toXDelta="100%p"  
        android:fromYDelta="0"  
        android:toYDelta="0" />  
</set>
```

```java
Animation translateAnimation = AnimationUtils.loadAnimation(this, R.anim.translate_animation);  
view.startAnimation(translateAnimation);
```

#### 帧动画

```xml
<?xml version="1.0" encoding="utf-8"?>
<animation-list xmlns:android="http://schemas.android.com/apk/res/android" >
    <item android:drawable="@drawable/bird_one" android:duration="100"/>
    <item android:drawable="@drawable/bird_two" android:duration="100"/>
    <item android:drawable="@drawable/bird_three" android:duration="100"/>
    <item android:drawable="@drawable/bird_four" android:duration="100"/>
    <item android:drawable="@drawable/bird_five" android:duration="100"/>
    <item android:drawable="@drawable/bird_six" android:duration="100"/>
    <item android:drawable="@drawable/bird_seven" android:duration="100"/>
    <item android:drawable="@drawable/bird_eight" android:duration="100"/>
</animation-list>
```

```java
public void frameAnim(View view) {
    v.setBackgroundResource(R.drawable.frame_animation);
    AnimationDrawable frameAnimation = (AnimationDrawable) v.getBackground();
    frameAnimation.start();
    //frameAnimation.stop();
}
```

#### 属性动画

```java
public void attrAnim(View view) {
    // 创建属性动画对象，指定要动画化的属性（这里是translationX）
    ObjectAnimator animator = ObjectAnimator.ofFloat(v, "translationX", 0f, 300f);

    // 设置动画时长
    animator.setDuration(2000);

    // 设置插值器，这里使用加速减速插值器
    animator.setInterpolator(new AccelerateDecelerateInterpolator());

    // 动画重复次数，设置为-1表示无限重复
    animator.setRepeatCount(ValueAnimator.INFINITE);

    // 设置动画重复模式，这里设置为反向重复
    animator.setRepeatMode(ValueAnimator.REVERSE);

    // 启动动画
    animator.start();
}
```






### 快捷键

| 快捷键                       | 说明                       |
| ---------------------------- | -------------------------- |
| 双击shift                    | 弹出搜索面板               |
| ctrl + E                     | 最近打开的文件             |
| shift +F6                    | 重命名                     |
| alt + 鼠标                   | 批量修改                   |
| ctrl +D                      | 向下复制一行               |
| Ctrl + alt +M                | 抽取方法                   |
| .var  或者 ctrl + alt + v    | 快速生成变量               |
| ctrl + F                     | 当前文件搜索               |
| ctrl +shift + F              | 全局搜索                   |
| ctrl + R 和 ctrl + shift + R | 当前文件搜索替换、全局替换 |
| ctrl + alt + o               | 清除无效导包               |
| ctrl + alt + L               | 格式化代码                 |
| ctrl + 鼠标 或者 alt + F7    | 查找使用                   |
| ctrl + alt + 左右            | 代码前进后退               |
| ctrl + alt + T               | try catch                  |
| ctrl + P                     | 方法参数提示               |
