## WPF

![](.\Images\wpf class_01.jpg)

<img src=".\Images\wpf class_02.jpg" style="zoom:150%;" />

### Appliction

应用程序与操作系统之间的接口

Keys:Create UI thread

```c#
// Creates and starts a secondary thread in a single threaded apartment (STA)
var thread = new Thread(MethodRunningOnSecondaryUIThread);
thread.SetApartmentState(ApartmentState.STA);
thread.IsBackground = true;
thread.Start();

// THIS METHOD RUNS ON A SECONDARY UI THREAD (THREAD WITH A DISPATCHER)
private void MethodRunningOnSecondaryUIThread()
{
	var secondaryUiThreadId = Thread.CurrentThread.ManagedThreadId;
	try
	{
		// On secondary thread, show a new Window before starting a new Dispatcher
		// ie turn secondary thread into a UI thread
		var window = new SecondaryUIThreadWindow();
		window.Show();
		Dispatcher.Run();
	}
	catch (Exception ex)
	{
		// Dispatch the exception back to the main ui thread and reraise it
		Application.Current.Dispatcher.Invoke(
			DispatcherPriority.Send,
			(DispatcherOperationCallback)delegate
		   {
			   // THIS CODE RUNS BACK ON THE MAIN UI THREAD
			   string msg = $"Exception forwarded from secondary UI thread {secondaryUiThreadId}.";
			   throw new Exception(msg, ex);
		   }
			, null);

		// NOTE - Application execution will only continue from this point
		//        onwards if the exception was handled on the main UI thread
		//        by Application.DispatcherUnhandledException
	}
}
```

### Namespace

Keys: xmlns:x、x:Class、InitializeComponent

```xaml
xmlns:x 命名空间，并将其映射到为代码隐藏类型添加支持的架构。 
x:Class 特性用于将代码 隐藏类与此特定 XAML 标记相关联
InitializeComponent ，以将标记中定义的 UI 与代码隐藏类合并在一起
x:Class 和 InitializeComponent 的组合可 确保在创建实现时正确地对其进行初始化。
```

Keys：x:Array、System

```xaml

<x:Array x:Key="Legends" Type="{x:Type model:LegendModel}">
    <model:LegendModel
                       Name="30°"
                       IsChecked="False"
                       LegendBrush="Blue" />
    <model:LegendModel
                       Name="50°"
                       IsChecked="False"
                       LegendBrush="Green" />
    <model:LegendModel
                       Name="120°"
                       IsChecked="True"
                       LegendBrush="Red" />
</x:Array>

xmlns:sys="clr-namespace:System;assembly=System"
xmlns:sys="clr-namespace:System;assembly=mscorlib"
xmlns:io="clr-namespace:System.IO;assembly=System.Runtime"

<x:Array x:Key="datas" Type="sys:Boolean">
	<sys:Boolean>false</sys:Boolean>
	<sys:Boolean>false</sys:Boolean>
	<sys:Boolean>true</sys:Boolean>
	<sys:Boolean>false</sys:Boolean>
	<sys:Boolean>false</sys:Boolean>
</x:Array>
```

Keys: x:reference

```xaml
ElementName是通过查找可视树找到对应控件，但有些控件，如DataGrid控件中的Header属性，MenuItem中的Header属性，不在可视树中，便找不到对应控件，此时可采用x:reference替代。
```

Keys: XmlnsDefinition

```
程序集多个命名空间 单一映射
[assembly: XmlnsDefinition("http://www.yd-tec.com/winfx/xaml/shared", "Y.Shen12DP.App.Ctls")]
[assembly: XmlnsDefinition("http://www.yd-tec.com/winfx/xaml/shared", "Y.Shen12DP.App.Ctls.Converters")]

 xmlns:ctls="http://www.yd-tec.com/winfx/xaml/shared"
```

Keys: x:static

```c#
DataContext="{x:Static common:AppMessages.Messages}"
ItemsSource="{x:Static common:AppMessages.Messages}"
```



### StringFormat

```
{0:#,#.0}
{0:dddd, MMMM dd}
{0:HH:mm}
```



### Animation

|                                                              |          |
| ------------------------------------------------------------ | -------- |
| 类型名+Animation                                             | 线性插值 |
| 类型名+AnimationUsingKeyFrames<br />线性 Linear_KeyFrame<br />离散 Discrete_KeyFrame<br />缓动 Easing_KeyFrame<br />样条 Spline_KeyFrame | 关键帧   |
| 类型名+AnimationUsingPath                                    | 路径     |

恢复动画之前的状态

方式一：UIElement.BeginAnimation(Button.WidthProperty, null)

方式二：启动一个新的 Animation，但对属性 From、To 赋值

Keys: Animation、KeyFrames、KeyTime

```xaml
LinearAnimation
	ColorAnimation
	PointAnimation
	DoubleAnimation
	ThicknessAnimation

KeyFrameAnimation
	DoubleAnimationUsingKeyFrames
		<LinearDoubleKeyFrame KeyTime="0:0:0" Value="180" />
		<DiscreteDoubleKeyFrame  KeyTime="0:0:0.5" Value="180"/>
		<SplineDoubleKeyFrame  KeySpline="1,0 0.5,1" KeyTime="0:0:1" Value="200" />
	
	ColorAnimationUsingKeyFrames
		LinearColorKeyFrame
		DiscreteColorKeyFrame
		SplineColorKeyFrame
	
	ThicknessAnimationUsingKeyFrames
		LinearThicknessKeyFrame
		DiscreteThicknessKeyFrame
		SplineThicknessKeyFrame
	
	PointAnimationUsingKeyFrames
		LinearPointKeyFrame
		DiscretePointKeyFrame
		SplinePointKeyFrame
	
	BooleanAnimationUsingKeyFrames
		DiscreteBooleanKeyFrame

	StringAnimationUsingKeyFrames
		DiscreteStringKeyFrame

	RectAnimationUsingKeyFrames
		LinearRectKeyFrame
		DiscreteRectKeyFrame
		SplineRectKeyFrame
		
	KeyTime
		"0:0:3"
		"30%"
		"Uniform" 	// 时间线平均分布每个关键帧所需要的时间
		"Paced"		// 间线按固定的帧率分配所需时间，这种情况下，变化大的关键帧分配时间长，变化小的关键帧分配时间段

PathAnimation
	PointAnimationUsingPath
	DoubleAnimationUsingPath
```

Keys：BeginStoryboard、Storyboard、Storyboard.TargetName、Storyboard.TargetProperty、Duration、To、By

```xaml
Storyboard
	AutoReverse="True"
	RepeatBehavior="Forever"
	Storyboard.TargetName="[Element.Name]"
	Storyboard.TargetProperty="[Element.Property]"
	To="[Color]" To="[double]"
	Duration="[TimeLine]" />

// RadioButton --> RoutEvent:Check、UnCheck --> EventTrigger --> BeginStoryboard --> Storyboard --> DoubleAnimation --> Border

<Storyboard x:Key="UserInfoStoryboard">
	<DoubleAnimation Duration="0:0:0.2" To="0"
					 Storyboard.TargetName="tt"
					 Storyboard.TargetProperty="X"/>
</Storyboard>

<Storyboard x:Key="CloseUserInfoStoryboard">
	<DoubleAnimation Duration="0:0:0.1"
					 Storyboard.TargetName="tt"
					 Storyboard.TargetProperty="X"/>
</Storyboard>

<Window.Triggers>
	<EventTrigger RoutedEvent="Button.Click" SourceName="btnUsreInfo">
		<BeginStoryboard Storyboard="{StaticResource UserInfoStoryboard}"/>
	</EventTrigger>
	<EventTrigger RoutedEvent="Button.Click" SourceName="btnCloseUserInfo">
		<BeginStoryboard Storyboard="{StaticResource CloseUserInfoStoryboard}"/>
	</EventTrigger>
</Window.Triggers>

<RadioButton x:Name="usrRadBtn" />
<Border>
	<Border.RenderTransform>
		<TranslateTransform X="250" x:Name="tt"/>
	</Border.RenderTransform>
</Border>
```

Keys:Event Trigger、Property Trigger、DataTrigger

```xaml
<ControlTemplate.Triggers>

	<!--  Event Trigger Example  -->
	<EventTrigger RoutedEvent="Border.MouseEnter" SourceName="innerBorder">
		<BeginStoryboard>
			<Storyboard>
				<ColorAnimation
					AutoReverse="True"
					Storyboard.TargetName="innerBorderBackgroundBrush"
					Storyboard.TargetProperty="Color"
					From="White"
					To="#CCCCFF"
					Duration="0:0:3" />
			</Storyboard>
		</BeginStoryboard>
	</EventTrigger>

	<!--  Property Trigger Example  -->
	<Trigger SourceName="contentPanel" Property="IsMouseOver" Value="True">
		<Trigger.EnterActions>
			<BeginStoryboard>
				<Storyboard>
					<ColorAnimation
						Storyboard.TargetName="contentPanelBrush"
						Storyboard.TargetProperty="Color"
						To="Purple"
						Duration="0:0:1" />
				</Storyboard>
			</BeginStoryboard>
		</Trigger.EnterActions>
		<Trigger.ExitActions>
			<BeginStoryboard>
				<Storyboard>
					<ColorAnimation
						Storyboard.TargetName="contentPanelBrush"
						Storyboard.TargetProperty="Color"
						To="White"
						Duration="0:0:1" />
				</Storyboard>
			</BeginStoryboard>
		</Trigger.ExitActions>
	</Trigger>
</ControlTemplate.Triggers>

<Style.Triggers>
	<EventTrigger RoutedEvent="Button.MouseEnter">
	  <EventTrigger.Actions>
		<BeginStoryboard>
		  <Storyboard>
			<DoubleAnimation
			  Storyboard.TargetProperty="(Button.Opacity)"
			  From="1.0" To="0.5" Duration="0:0:0.5" AutoReverse="True"
			  RepeatBehavior="Forever" />
		  </Storyboard>
		</BeginStoryboard>
	  </EventTrigger.Actions>
	</EventTrigger>  
	
	<EventTrigger RoutedEvent="Button.MouseLeave">
	  <EventTrigger.Actions>
		<BeginStoryboard>
		  <Storyboard>
			<DoubleAnimation
			  Storyboard.TargetProperty="(Button.Opacity)"
			  To="1" Duration="0:0:0.1" />
		  </Storyboard>
		</BeginStoryboard>
	  </EventTrigger.Actions>
	</EventTrigger>   
	
	<EventTrigger RoutedEvent="Button.Click">
	  <EventTrigger.Actions>
		<BeginStoryboard>
		  <Storyboard>
			<ColorAnimation 
			  Storyboard.TargetProperty="(Button.Background).(SolidColorBrush.Color)"
			  From="Orange" To="White" Duration="0:0:0.1" AutoReverse="True" />
		  </Storyboard>
		</BeginStoryboard>
	  </EventTrigger.Actions>
	</EventTrigger>  
  </Style.Triggers>
```

Keys: Render


```c#
CompositionTarget.Rendering += UpdateColor;
```



### MVVM Foundation

![](Images\mvvm_foundation_frame.PNG)

> + Messenger：View和ViewModel 以及 ViewModel和ViewModel 之间的消息通知和接收
> + ObservableObject：等价于ViewModelBase，被ViewModel继承，调用完成后立即释放，防止内存泄漏
> + PropertyObserver：封装INotifyPropertyChanged.PropertyChanged，通过其对某个对象的属性变更注册回调函数，当属性变更时触发回调函数
> + RelayCommand：封装Command，包括execution执行逻辑等



### Binding

> Bind Mode
>
> | Binding  定义在目标上，目标须继承自 DependencyObject，绑定目标 property 须是 dependency property，绑定源 property 不需是 dependency property |                        |             |
> | ------------------------------------------------------------ | ---------------------- | ----------- |
> | One Way                                                      | 目标 <---- 源          | Convert     |
> | One Way to Source                                            | 目标 ----> 源          | ConvertBack |
> | Two Way                                                      | 目标 <---> 源          |             |
> | One Time                                                     | one way 的一种简化形式 |             |
> | Default                                                      | 依控件而定             |             |
>
> TargetNullValue: 数据源 Null 值，呈现的默认值

Keys: UpdateSourceTrigger、LostFocus、PropertyChanged、Explicit

| UpdateSourceTrigger | 操作                     | 场景                         |
| ------------------- | ------------------------ | ---------------------------- |
| LostFocus           | TextBox 控件失去焦点时   | 与验证逻辑关联的 TextBox     |
| PropertyChanged     | 键入 TextBox 时          | 聊天室窗口中的 TextBox 控件  |
| Explicit            | 应用调用 UpdateSource 时 | 用户按“提交”按钮时才更新源值 |

Keys: Global Static Resource

```xaml
<x:Array x:Key="datas" Type="sys:String">
	<sys:String>Hello Zhaoxi</sys:String>
	<sys:String>Zhaoxi</sys:String>
</x:Array>
<TextBlock Text="{Binding Source={StaticResource datas}, Path=[1]}" FontSize="30"/>
<TextBlock Text="{Binding Path=(local:GlobalMonitor.MainModel).Value}" />
<TextBlock Text="{Binding Path=Value,Source={x:Static local:GlobalMonitor.MainModel}}"/>

xmlns:com="clr-namespace:GTS.MaxSign.Controls.Assets.Components"
<Popup Opened="{DXEvent Handler='$com:PopupFocusHelper.Popup_Opened(@sender,@args)'}"/>

namespace GTS.MaxSign.Controls.Assets.Components
{
    public static class PopupFocusHelper
    {
        public static void Popup_Opened(object sender, System.EventArgs e)
        {
            Popup popup = sender as Popup;
            IntPtr handle = GetHwnd(popup);
            SetFocus(handle);
        }

        [DllImport("User32.dll")]
        public static extern IntPtr SetFocus(IntPtr hWnd);

        public static IntPtr GetHwnd(Popup popup)
        {
            HwndSource source = (HwndSource)PresentationSource.FromVisual(popup.Child);
            return source.Handle;
        }
    }
}
```

Keys: InputBindings、KeyBinding 、MouseBinding

```xaml
<Grid.InputBindings>
	<MouseBinding
		Command="{Binding OpenViewCommand}"
		CommandParameter="{Binding}"
		MouseAction="LeftDoubleClick" />
</Grid.InputBindings>

<TextBox>
	<TextBox.InputBindings>
		<KeyBinding
			Key="Enter"
			Command="{Binding AngleChangedCmd}"
			CommandParameter="{Binding ElementName=txtAngle}" />
	</TextBox.InputBindings>
</TextBox>
```

Keys: Delay

```xaml
<Slider
	VerticalAlignment="Center"
	IsSnapToTickEnabled="True"
	Maximum="1"
	Minimum="0"
	TickFrequency="0.01"
	Value="{Binding CleanWater, Delay=200}" />
```

Keys:  Aysnc Binding

```c#
<TextBlock
    Width="100"
    HorizontalAlignment="Center"
    Background="Honeydew"
    Text="{Binding SlowestDP, IsAsync=True, FallbackValue='Loading...'}" />
```

Keys: PriorityBinding

```c#
<TextBlock
	Width="100"
	HorizontalAlignment="Center"
	Background="Honeydew">
	<TextBlock.Text>
		<PriorityBinding FallbackValue="Please wait...">
			<Binding IsAsync="True" Path="SlowestDP" />
			<Binding IsAsync="True" Path="SlowerDP" />
			<Binding Path="FastDP" />
		</PriorityBinding>
	</TextBlock.Text>
</TextBlock>
```

Keys: DXBinding

```xaml
@s, @Self
@p, @TemplatedParent
@e, @ElementName
@r, @StaticResource
@a, @FindAncestor
@c, @DataContext
@v, @value
@Reference
$int, $double, ..., $string, $object, $bool

<TextBlock Text="{DXBinding '@s.PropA'}"/>
<TextBlock Text="{DXBinding '@Self.PropA'}"/>

<TextBlock Text="{DXBinding '@e(bt).PropA'}"/>
<TextBlock Text="{DXBinding '@e(myButton).Content'}"/>
<Button Click="{DXEvent '@e(checkBox).IsChecked=true'}"/>
<TextBlock Text="{DXBinding '@ElementName(bt).PropA'}"/>
Legend="{DXBinding '@e(lbLegendMode).SelectedItem.Tag != $local:LegendMode.Common ? @e(defaultPaneLegend) : null'}"
RisingBarBrush="{DXBinding '@e(lbDataType).SelectedIndex == 0 ? `#DA5859` : null'}"

<TextBlock Text="{DXBinding '@r(resource)'}"/>
<TextBlock Text="{DXBinding '@StaticResource(resource)'}"/>

<TextBlock Text="{DXBinding '@a($Window).Title'}"/>
<TextBlock Text="{DXBinding '@a($Window, 1).Title'}"/>
<TextBlock Text="{DXBinding '@a($ComboBox).Text',Mode=OneTime}" />
<TextBlock Text="{DXBinding '@FindAncestor($Window).Title'}"/>
<TextBlock Text="{DXBinding '@FindAncestor($Window, 1).Title'}"/>
<TextBlock Text="Text" Visibility="{DXBinding $Visibility.Hidden}"/>
<TextBlock Text="{DXBinding 'typeof($int)'}"/>
<TextBlock Text="{DXBinding 'typeof($Window)'}"/>
<TextBlock Text="{DXBinding 'typeof($dx:DXWindow)'}"/>
<TextBlock Text="{DXBinding '(PropertyA as $dx:DXWindow).CurrentWindow'}"/>

<TextBlock Text="{DXBinding '@c'}"/>
<TextBlock Text="{DXBinding '@c.PropA'}"/>
<TextBlock Text="{DXBinding '@DataContext'}"/>
<TextBlock Text="{DXBinding '@DataContext.PropA'}"/>
MinLimit="{DXBinding @c.OptimalTemperature + 10, Mode=OneTime}"
IsEnabled="{DXBinding '!@c.AutoGrid'}" />
DisplayFormatString="{DXBinding '`0 `+@c.GridAlignment.ToString().ToLower() + `(s)`'}" />
IsEnabled="{DXBinding '@c.WorkTimeOptionsEnabled and @c.WorkTimeOnly'}"


<TextBlock Text="{DXBinding '@Reference(bt).Content'}"/>

<TextBlock Text="{DXBinding '$Application.Current.FindResource(`trans0471`).ToString()'}"/>
<TextBlock Text="{DXBinding Expr='!$string.IsNullOrEmpty(LogTypeText) ?LogTypeText:$Application.Current.FindResource(`trans0471`)',BackExpr='@v'}"/>

<TextBlock Text="{DXBinding '(double)1'}"/>
<TextBlock Text="{DXBinding 'Customer.FirstName + ` ` + Customer.LastName'}"/>

<TextBlock Text="{DXBinding '2+2'}"/>
<TextBlock Text="{DXBinding 'Calculate()'}"/>
<TextBlock Text="{DXBinding 'PropA+PropB'}"/>
<TextBlock Text="{DXBinding 'Calculate(PropB)'}"/>
<TextBlock Text="{DXBinding 'PropA.PropB.Calculate().PropC'}"/>
<TextBlock Text="{DXBinding 'Calculate(PropA, PropB.Prop1 + 2).PropC'}"/>



<Control IsEnabled="{DXBinding Expr='!IsDisabled', BackExpr='!@v'}"/>
<TextBox Text="{DXBinding '!PropA', BackExpr='PropA=!@v'}"/>
<TextBlock Visibility="{DXBinding EnableBand?`Visible`:`Collapsed`}">
<TextBlock Visibility="{DXBinding 'TestTasks.Count>0?`Collapsed`:`Visible`'}" />
<TextBlock Tag="{DXBinding 'PropA+2', BackExpr='$int.Parse(@v)-2', Mode=TwoWay}"/>
<TextBlock Text="{DXBinding '!PropA', BackExpr='!$bool.Parse(@value)', Mode=TwoWay}"/>
<Control Visibility="{DXBinding Expr='IsVisible ? `Visible` : `Collapsed`', BackExpr='@v == $Visibility.Visible'}"/>
<RadioButton IsChecked="{DXBinding Expr='MainContent.GetType() == typeof($local:TestSysView)', BackExpr='true'}" />
<TextBox Text="{DXBinding 'FirstName + ` ` + LastName', BackExpr='FirstName=@v.Split(` `[0])[0]; LastName=@v.Split(` `[0])[1]'}"/>
<CheckBox Visibility="{DXBinding '( (@e(btnSkip).IsChecked)  &amp;&amp; (@e(btnSkip).Visibility == $Visibility.Visible))?`Visible`:`Collapsed`'}" />


DataSource="{DXBinding 'new $local:WebSitePerformanceIndicator().Data'}"
DataSource="{DXBinding '$local:RealEstateData.GetAnnualData()'}"
public static class RealEstateData
{
	public static List<RealEstateDataAnnualPoint> GetAnnualData()
	{
		...
	}
}
```

Keys: DxEvent

```xaml
<StackPanel>
    <StackPanel.DataContext>
        <local:ViewModel />
    </StackPanel.DataContext>
    <Button Content="OK" Loaded="{DXEvent Handler='Initialize()'}" />
    <Button Content="OK" Loaded="{DXEvent Handler='Initialize(); Load()'}" />
</StackPanel>

<Button Content="OK" Loaded="{DXEvent Handler='Initialize(@sender.Content, @args, @e(tb).Text)'}"/>

<Button Click="{DXEvent '@e(checkBox).IsChecked=true'}"/>

<Border  MouseDown="{DXEvent Handler=@a($UserControl).DataContext.Legend_MouseDown(@s.DataContext)}">
 
<ContextMenu x:Key="DutMenu" DataContext="{DXBinding @a($TreeView).DataContext}">
	<MenuItem Click="{DXEvent Handler='AddDutProject(@a($ContextMenu).PlacementTarget)'}" Header="{DynamicResource trans0437}" />
	<MenuItem Click="{DXEvent Handler='AddDutModel(@a($ContextMenu).PlacementTarget)'}" Header="{DynamicResource trans0438}" />
	<MenuItem
		Click="{DXEvent Handler='DeleteDut(@a($ContextMenu).PlacementTarget)'}"
		Header="{DynamicResource trans0013}"
		IsEnabled="{DXBinding '(@a($ContextMenu).PlacementTarget.DataContext.Name !=`Default Program`) &amp;&amp; (@a($ContextMenu).PlacementTarget.DataContext.Name !=`Default Model`)'}" />
	<MenuItem
		Click="{DXEvent Handler='RenameDut(@a($ContextMenu).PlacementTarget)'}"
		Header="{DynamicResource trans0016}"
		IsEnabled="{DXBinding '(@a($ContextMenu).PlacementTarget.DataContext.Name !=`Default Program`) &amp;&amp; (@a($ContextMenu).PlacementTarget.DataContext.Name !=`Default Model`)'}" />
</ContextMenu>
```



### CollectionView

![](Images\wpf_collectionview.jpg)


### MarkupExtension

Keys: x:Null

```xaml
<Button Background="{x:Null}">Click</Button>
```
Keys: x:Static

```xaml
<TextBlock Background="{x:Static SystemColors.ActiveCaptionBrush}" Text="Foo" />
```

```c#
TextBlock tb = new TextBlock();
tb.Background = SystemColors.ActiveCaptionBrush;
tb.Text = "Foo";
```

Keys: StaticResource

```xaml
<Grid>
  <Grid.Resources>
    <SolidColorBrush x:Key="fooBrush" Color="Yellow" />
  </Grid.Resources>

  <Button Background="{StaticResource fooBrush}" Name="myButton" />
</Grid>

<TextBlock Name="myText"
    Background="{StaticResource
        {x:Static SystemColors.ActiveCaptionBrushKey}}" />
```

```c#
myButton.Background = (Brush)myButton.FindResource("fooBrush");

myText.Background = (Brush)myButton.FindResource(SystemColors.ActiveCaptionBrushKey);
```

Keys: DynamicResource

```xaml
<TextBlock Name="myText"
    Background="{DynamicResource
        {x:Static SystemColors.ActiveCaptionBrushKey}}" />
```

```c#
myText.SetResourceReference(TextBlock.BackgroundProperty),
	SystemColors.ActiveCaptionBrushKey);
```

Keys: ComponentResourceKey

```xaml
<ResourceDictionary
  xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
  xmlns:local="clr-namespace:MyComponent">

  <SolidColorBrush x:Key="{ComponentResourceKey {x:Type loc:MyType}, brush1}"
                   Color="Red" />
  <SolidColorBrush x:Key="{ComponentResourceKey {x:Type loc:MyType}, brush2}"
                   Color="Green" />

</ResourceDictionary>

<TextBlock Background="{DynamicResource
              {ComponentResourceKey {x:Type loc:MyType}, brush1}}" />

```

```c#
ResourceDictionary rd = new ResourceDictionary();
rd.Add(new ComponentResourceKey(typeof(MyType), "brush1"),
       new SolidColorBrush(Colors.Red));
rd.Add(new ComponentResourceKey(typeof(MyType), "brush2"),
       new SolidColorBrush(Colors.Green));

TextBlock myText = new TextBlock();
myText.SetResourceReference(TextBlock.Background,
    new ComponentResourceKey(typeof(MyType), "brush1"));
```

Keys: FontUriExtension

```xaml
<Glyphs FontUri="{loc:FontUri Calibri}"  FontRenderingEmSize="40"
              UnicodeString="Hello, world" Fill="Black" OriginY="30" />
```

```c#
public class FontUriExtension : MarkupExtension
{
    string fontFamilyName;

    public FontUriExtension(string fontFamilyName)
    {
        this.fontFamilyName = fontFamilyName;
    }

    public override object ProvideValue(IServiceProvider serviceProvider)
    {
        Typeface tf = new Typeface(this.fontFamilyName);
        GlyphTypeface gtf = null;
        if (!tf.TryGetGlyphTypeface(out gtf))
        {
            throw new ArgumentException("Font family not found");
        }
        return gtf.FontUri;
    }
}
```
### TypeConverter

```c#
[TypeConverter(typeof(LengthConverter))]
public double Width { get; set; }
[TypeConverter(typeof(LengthConverter))]
public double Height { get; set; }
```

### ValueConverter

Keys: IValueConverter、Convert、ConvertBack

```cs
[ValueConversion(typeof(double), typeof(byte))]
public class DoubleToByteConverter : IValueConverter
{
    //当值从绑定源传播给绑定目标时，调用方法Convert
    public object Convert(object value, Type typeTarget,object param, CultureInfo culture)
    {
        return (byte)(double)value;
    }
    
    //当值从绑定目标传播给绑定源时，调用此方法ConvertBack
    public object ConvertBack(object value, Type typeTarget,object param, CultureInfo culture)
    {
        return (double)value;
    }
}
```

Keys: IMultiValueConverter

```xaml
<Border Grid.Row="0" Grid.Column="2">
    <Border.Background>
        <MultiBinding Converter="{StaticResource convRgbToColor}">
            <Binding ElementName="scrRed" Path="Value" Mode="OneWay "/>
            <Binding ElementName="scrGreen" Path="Value" Mode="OneWay "/>
            <Binding ElementName="scrBlue" Path="Value" Mode="OneWay "/>
        </MultiBinding>
    </Border.Background>
</Border>
```

```c#
public class RgbToColorConverter : IMultiValueConverter
{
    public object Convert(object[] value, Type typeTarget, object param, CultureInfo culture)
    {
        Color clr = Color.FromRgb((byte)(double)value[0], 
                                  (byte)(double)value[1],
                                  (byte)(double)value[2]);

        if (typeTarget == typeof(Color))
            return clr;

        if (typeTarget == typeof(Brush))
            return new SolidColorBrush(clr);

        return null;
    }
    public object[] ConvertBack(object value, Type[] typeTarget, object param, CultureInfo culture)
    {
        Color clr;
        object[] primaries = new object[3];

        if (value is Color)
            clr = (Color) value;

        else if (value is SolidColorBrush)
            clr = (value as SolidColorBrush).Color;

        else
            return null;

        primaries[0] = clr.R;
        primaries[1] = clr.G;
        primaries[2] = clr.B;
        return primaries;
    }
}
```

```xaml
 <TextBlock>
     <TextBlock.Text>
         <MultiBinding Converter="{StaticResource conv}" ConverterParameter="Operating System Version: {0}&#x000A;.NET Version: {1}&#x000A;Machine Name: {2}&#x000A;User Name: {3}&#x000A;User Domain Name: {4}&#x000A;System Directory: {5}&#x000A;Current Directory: {6}&#x000A;Command Line: {7}">
             <Binding Source="{x:Static s:Environment.OSVersion}" />
             <Binding Source="{x:Static s:Environment.Version}" />
             <Binding Source="{x:Static s:Environment.MachineName}" />
             <Binding Source="{x:Static s:Environment.UserName}" />
             <Binding Source="{x:Static s:Environment.UserDomainName}" />
             <Binding Source="{x:Static s:Environment.SystemDirectory}" />
             <Binding Source="{x:Static s:Environment.CurrentDirectory}" />
             <Binding Source="{x:Static s:Environment.CommandLine}" />
         </MultiBinding>
     </TextBlock.Text>
 </TextBlock>
```

```c#
public class FormattedMultiTextConverter : IMultiValueConverter
{
    public object Convert(object[] value, Type typeTarget, 
                          object param, CultureInfo culture)
    {
        return String.Format((string) param, value);
    }
    public object[] ConvertBack(object value, Type[] typeTarget, 
                                object param, CultureInfo culture)
    {
        return null;
    }
}
```

### Behavior

Keys: i:Interaction.Behaviors

```xaml
<ItemsPanelTemplate x:Key="pt">
	<StackPanel>
		<i:Interaction.Behaviors>
			<local:MoveBehavior />
		</i:Interaction.Behaviors>
	</StackPanel>
</ItemsPanelTemplate>
```





### Command

Keys: ICommand、CanExecuteChanged、RoutedCommand

```xaml
CanExecuteChanged --> CanExecute --> Execute
ICommand 的 WPF 实现是 RoutedCommand 类
```



Keys：Command、CommandParameter、EventTrigger、CallMethodAction、InvokeCommandAction

~~~xaml
1.通过 事件 
<Button Click="Button_Click"></Button>

2.通过 命令
<Button Command="{Binding Path=DataContext.OprateDataGridRow, RelativeSource={RelativeSource Mode=FindAncestor,AncestorType={x:Type UserControl}}}"
        CommandParameter="{Binding RelativeSource={x:Static RelativeSource.Self}}">
</Button>	//  RelativeSource.Self     Button 自身作为参数

3.通过 事件触发器 
System.Windows.Interactivity.dll
	这个程序集定义了支持行为的基本类，它是行为特征的基础
Microsoft.Expression.Interactions.dll
	这个程序集通过添加可选的以核心行为类为基础的动作和触发器类，并增加了一些有用的扩展
(或者直接安装 NuGet 包: Expression.Blend.Sdk or Expression.Blend.Sdk.WPF)

xmlns:Interaction="http://schemas.microsoft.com/expression/2010/interactions"
xmlns:Interactivity="http://schemas.microsoft.com/expression/2010/interactivity"
<Button>
    <Interactivity:Interaction.Triggers>
        <Interactivity:EventTrigger EventName="Click">
            <Interaction:CallMethodAction TargetObject="{Binding}" MethodName="Button_Click"/>
        </Interactivity:EventTrigger>
        <Interactivity:EventTrigger EventName="MouseMove">
            <Interactivity:InvokeCommandAction Command="{Binding MouseMoveCommand}"  CommandParameter="{Binding ElementName=ic}"/>
        </Interactivity:EventTrigger>
    </Interactivity:Interaction.Triggers>
</Button>

<TextBox
	Width="300"
	HorizontalAlignment="Center"
	 Text="{Binding Value, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}">
	<Interactivity:Interaction.Triggers>
		<Interactivity:EventTrigger EventName="KeyUp">
			<Interactivity:InvokeCommandAction Command="{Binding KeyUpCommand}" />
		</Interactivity:EventTrigger>
	</Interactivity:Interaction.Triggers>
</TextBox>

<TextBox
         x:Name="txtValue"
         Grid.Column="1"
         VerticalContentAlignment="Center"
         Template="{StaticResource SingleTextBox.Template}"
         Text="{Binding Model.Value, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged, ValidatesOnDataErrors=True, NotifyOnValidationError=True}"
         ToolTip="{Binding Model.ToolTip}"
         Validation.Error="Value_ErrorEvent"
         Validation.ErrorTemplate="{StaticResource advErrorTemplate}">
    <Interactivity:Interaction.Triggers>
        <Interactivity:EventTrigger EventName="PreviewTextInput">
            <Interaction:CallMethodAction MethodName="PreviewTextInput" TargetObject="{Binding Model}" />
        </Interactivity:EventTrigger>
        <Interactivity:EventTrigger EventName="PreviewKeyDown">
            <Interaction:CallMethodAction MethodName="SingleTextBox_PreviewKeyDown" TargetObject="{Binding Model}" />
        </Interactivity:EventTrigger>
        <Interactivity:EventTrigger EventName="Validation.Error">
            <Interaction:CallMethodAction MethodName="Value_ErrorEvent" TargetObject="{Binding Model}" />
        </Interactivity:EventTrigger>
    </Interactivity:Interaction.Triggers>
</TextBox>
~~~

​	

### Chart

#### ChartControl

Keys：DataSource、Titles、Legend、CrosshairOptions、ToolTipOptions、ToolTipController、Palette

~~~xaml
<dxc:ChartControl
	AnimationMode="OnLoad"
	CrosshairEnabled="True"
	DataSource="{Binding XY2DModel.PointsData}"
	ToolTipEnabled="False">
	<dxc:ChartControl.Legend>
		<dxc:Legend
			HorizontalPosition="Left"
			MarkerMode="CheckBoxAndMarker"
			Orientation="Vertical"
			ReverseItems="False"
			VerticalPosition="Center"
			Visibility="Collapsed" />
	</dxc:ChartControl.Legend>
	<dxc:ChartControl.Titles>
		<dxc:Title
			HorizontalAlignment="Center"
			Content="ChartControl Title"
			Dock="Top"
			Visibility="Collapsed" />
	</dxc:ChartControl.Titles>
	<dxc:ChartControl.CrosshairOptions>
		<dxc:CrosshairOptions
			ContentShowMode="Label"
			CrosshairLabelMode="ShowCommonForAllSeries"
			GroupHeaderPattern="{}{A}°"
			LinesMode="Auto"
			ShowArgumentLabels="True"
			ShowGroupHeaders="True" />
	</dxc:ChartControl.CrosshairOptions>
	<dxc:ChartControl.ToolTipOptions>
		<dxc:ToolTipOptions
			ShowForPoints="True"
			ShowForSeries="False"
			ShowHint="False">
			<dxc:ToolTipOptions.ToolTipPosition>
				<dxc:ToolTipMousePosition Location="TopLeft" />
			</dxc:ToolTipOptions.ToolTipPosition>
		</dxc:ToolTipOptions>
	</dxc:ChartControl.ToolTipOptions>
	<dxc:ChartControl.ToolTipController>
		<dxc:ChartToolTipController
			AutoPopDelay="0"
			CloseOnClick="False"
			ContentMargin="1"
			InitialDelay="0:0:0.1"
			OpenMode="OnHover"
			ShowBeak="False"
			ShowShadow="False"
			ToolTipOpening="ChartToolTipController_ToolTipOpening" />
	</dxc:ChartControl.ToolTipController>
	<dxc:ChartControl.Palette>
		<dxc:CustomPalette>
			<dxc:CustomPalette.Colors>
				<Color>#c32136</Color>
				<Color>#e4c6d0</Color>
				<Color>#cca4e3</Color>
				<Color>#789262</Color>
				<Color>#493131</Color>
			</dxc:CustomPalette.Colors>
		</dxc:CustomPalette>
	</dxc:ChartControl.Palette>
</dxc:ChartControl>
~~~



#### XYDiagram2D

Keys：EnableAxisXNavigation、EnableAxisYNavigation、SeriesDataMember、SeriesTemplate、AxisX(Title，CrosshairAxisLabelOptions，ScaleOptions，WholeRange)、AxisY、DefaultPane、NavigationOptions、

~~~xaml
<dxc:XYDiagram2D
	Margin="-10,0,-2,0"
	EnableAxisXNavigation="{Binding XY2DModel.NavigationModel.EnableAxisX}"
	EnableAxisYNavigation="{Binding XY2DModel.NavigationModel.EnableAxisY}"
	SeriesDataMember="ModeLegend">
	<dxc:XYDiagram2D.AxisX>
		<dxc:AxisX2D
			Alignment="Near"
			GridLinesMinorVisible="True"
			GridLinesVisible="True"
			Interlaced="False"
			MinorCount="10"
			TickmarksMinorVisible="True">
			<dxc:AxisX2D.Title>
				<dxc:AxisTitle
					Content="{DynamicResource trans0032}"/>
			</dxc:AxisX2D.Title>
			<dxc:AxisX2D.CrosshairAxisLabelOptions>
				<dxc:CrosshairAxisLabelOptions Pattern="{}{A:0}°" />
			</dxc:AxisX2D.CrosshairAxisLabelOptions>
			<!--<dxc:AxisX2D.Label>
				<dxc:AxisLabel TextPattern="{}{A}°"  />
			</dxc:AxisX2D.Label>-->
			<dxc:AxisX2D.NumericScaleOptions>
				<!--<dxc:AutomaticNumericScaleOptions AggregateFunction="Maximum" />-->
				<dxc:ManualNumericScaleOptions
					AggregateFunction="None"
					AutoGrid="False"
					GridSpacing="20" />
				<!--<dxc:ContinuousNumericScaleOptions />-->
				<!--<dxc:IntervalNumericScaleOptions AutoGrid="True"  ></dxc:IntervalNumericScaleOptions>-->
			</dxc:AxisX2D.NumericScaleOptions>

			<dxc:AxisX2D.WholeRange>
				<dxc:Range
					dxc:AxisY2D.AlwaysShowZeroLevel="True"
					MaxValue="{Binding XY2DModel.AxisXModel.RangeMax}"
					MinValue="{Binding XY2DModel.AxisXModel.RangeMin}"
					SideMarginsValue="0" />
			</dxc:AxisX2D.WholeRange>
		</dxc:AxisX2D>
	</dxc:XYDiagram2D.AxisX>
	<dxc:XYDiagram2D.AxisY>
		<dxc:AxisY2D
			GridLinesMinorVisible="True"
			GridLinesVisible="True"
			Interlaced="False"
			TickmarksMinorVisible="True">
			<dxc:AxisY2D.Title>
				<dxc:AxisTitle
					Padding="0"
					Content="{Binding XY2DModel.AxisYModel.Title}"/>
			</dxc:AxisY2D.Title>
			<dxc:AxisY2D.Label>
				<dxc:AxisLabel Padding="0" />
			</dxc:AxisY2D.Label>
			<dxc:AxisY2D.WholeRange>
				<dxc:Range dxc:AxisY2D.AlwaysShowZeroLevel="False" />
			</dxc:AxisY2D.WholeRange>
		</dxc:AxisY2D>
	</dxc:XYDiagram2D.AxisY>
	<dxc:XYDiagram2D.DefaultPane>
		<dxc:Pane>
			<dxc:Pane.AxisXScrollBarOptions>
				<dxc:ScrollBarOptions BarThickness="10" Visible="True" />
			</dxc:Pane.AxisXScrollBarOptions>
			<dxc:Pane.AxisYScrollBarOptions>
				<dxc:ScrollBarOptions
					Alignment="Near"
					BarThickness="10"
					Visible="True" />
			</dxc:Pane.AxisYScrollBarOptions>
		</dxc:Pane>
	</dxc:XYDiagram2D.DefaultPane>
	<dxc:XYDiagram2D.NavigationOptions>
		<dxc:NavigationOptions
			AxisXMaxZoomPercent="2500"
			AxisYMaxZoomPercent="2500"
			UseKeyboard="True"
			UseMouse="True"
			UseScrollBars="True" />
	</dxc:XYDiagram2D.NavigationOptions>
</dxc:XYDiagram2D>
~~~

Keys：PaneItemsSource、SeriesItemsSource、SecondaryAxisYItemsSource

~~~xaml
<dxc:XYDiagram2D
PaneItemsSource="{Binding Panes}"
SeriesItemsSource="{Binding SensorDataSeries}"
SecondaryAxisYItemsSource="{Binding Panes}"
EnableAxisXNavigation="True"
BeforeZoom="{DXEvent '@c.LimitZoom(@args)'}"/>
~~~



#### LineSeries2D

Keys：AllowResample、AnimationAutoStartMode、ArgumentDataMember、CrosshairContentShowMode、CrosshairLabelPattern、LabelsVisibility、MarkerSize、MarkerVisible、ShowInLegend、ToolTipPointPattern、ValueDataMember；LegendMarkerTemplate、MarkerModel(PointTemplate，)、LineStyle、SeriesAnimation、PointAnimation、Label、ToolTipPointTemplate

~~~xaml
<dxc:LineSeries2D
	x:Name="series"
	AllowResample="False"
	AnimationAutoStartMode="SetFinalState"
	ArgumentDataMember="Theta"
	CrosshairContentShowMode="Label"
	CrosshairLabelPattern="{}{S} : {V:0.00} dB"
	LabelsVisibility="False"
	MarkerSize="7"
	MarkerVisible="False"
	ShowInLegend="True"
	ToolTipPointPattern="{}{A}°,{V:0.00}"
	ValueDataMember="Gain">
	<dxc:LineSeries2D.LegendMarkerTemplate>
		<DataTemplate>
			<StackPanel Orientation="Horizontal">
				<Grid Width="12" Height="12">
					<Ellipse
						x:Name="ellipse"
						Stretch="Uniform"
						Stroke="{Binding Path=MarkerLineBrush}"
						StrokeDashArray="{Binding Path=MarkerLineStyle.DashStyle.Dashes}"
						StrokeThickness="{Binding Path=MarkerLineStyle.Thickness}" />
				</Grid>
				<TextBlock
					Width="55"
					Margin="4,0,0,0"
					VerticalAlignment="Center"
					Text="{Binding Path=Text}" />
			</StackPanel>
		</DataTemplate>
	</dxc:LineSeries2D.LegendMarkerTemplate>
	<dxc:LineSeries2D.MarkerModel>
		<dxc:SimpleMarker2DModel />
	</dxc:LineSeries2D.MarkerModel>
	<dxc:LineSeries2D.LineStyle>
		<dxc:LineStyle LineJoin="Round" Thickness="1" >
			<DashStyle Dashes="" Offset="0" />
		</dxc:LineStyle.DashStyle>-->
		</dxc:LineStyle>
	</dxc:LineSeries2D.LineStyle>
	<dxc:LineSeries2D.Label>
		<dxc:SeriesLabel>
			<dxc:SeriesLabel.
		</dxc:SeriesLabel>
	</dxc:LineSeries2D.Label>
	<dxc:LineSeries2D.SeriesAnimation>
		<dxc:Line2DBlowUpAnimation />
	</dxc:LineSeries2D.SeriesAnimation>
	<dxc:LineSeries2D.PointAnimation>
		<dxc:Marker2DFadeInAnimation />
	</dxc:LineSeries2D.PointAnimation>
	<dxc:LineSeries2D.Label>
		<dxc:SeriesLabel
			dxc:MarkerSeries2D.Angle="45"
			ConnectorVisible="False"
			Indent="5"
			ResolveOverlappingMode="Default" />
	</dxc:LineSeries2D.Label>
	<dxc:LineSeries2D.ToolTipPointTemplate>
		<DataTemplate>
			<Grid>
				<Label Content="{Binding ToolTipText}" FontSize="12" />
			</Grid>
		</DataTemplate>
	</dxc:LineSeries2D.ToolTipPointTemplate>
</dxc:LineSeries2D>
~~~



### Graphics

#### Shapes

Keys: Ellipse、Path、Rectangle、Line、Polyline、Polygon



#### Brushes

Keys: SolidColorBrush、LinearGradientBrush、RadialGradientBrush、

Keys: ImageBrush、DrawingBrush、VisualBrush、

```

TileBrush
ImageBrush: bitmap
DrawingBrush: scalabe drawing 
VisualBrush: visual element 

```



#### Pen

Keys: Line Thickness、Dash Patterns、Cap Details、



### Style

Keys: Control Style

```xaml
<Style x:Key="style">
	<Setter Property="Label.Content" Value="Hello"/>
	<Setter Property="Control.Background" Value="Orange"/>
</Style>

<Style x:Key="BigFontButtonStyle">
    <Setter Property="Control.FontFamily" Value="Times New Roman" />
    <Setter Property="Control.FontSize" Value="18" />
    <Setter Property="Control.FontWeight" Value="Bold" />
</Style>
```

Keys: BaseOn

```xaml
<Style TargetType="{x:Type Button}">
    <Setter Property="Control.FontSize" Value="24" />
    <Setter Property="Control.Foreground" Value="Blue" />
    <Setter Property="Control.HorizontalAlignment" Value="Center" />
    <Setter Property="Control.Margin" Value="24" />
</Style>

<Style x:Key="hotbtn"
    TargetType="{x:Type Button}"
    BasedOn="{StaticResource {x:Type Button}}">
    <Setter Property="Control.Foreground" Value="Red" />
</Style>
```



### Trigger

Description：通过指定属性的变化或者事件的触发时，更改控件的外观和行为，并且并触发器监测的属性必然为依赖属性，事件必然为路由事件

如果再控件模板和样式中都设置了触发器，样式触发器具有优先权

样式触发器具有一定限制，不能使用 Setter.TargetName 属性，不能深入到可视化树中来改变嵌套的元素

Keys：Property Trigger、Binding DataTrigger、ControlTemplate.Triggers、MultiDataTrigger、EventTrigger(RouteEvent、Actions、Storyboard)、EventSetter

```xaml
// Trigger/MultiTrigger(属性触发器)
<Style x:Key="ButtonStyle" TargetType="{x:Type Button}">
    <Style.Triggers>
        <Trigger Property="IsPressed" Value="True">
            <Setter Property="Opacity" Value="0.5" />
        </Trigger>
        <Trigger Property="IsEnabled" Value="False">
            <Setter Property="Foreground" Value="Red" />
        </Trigger>
    </Style.Triggers>
</Style>

<Style x:Key="MulitTriggerButtonStyle" TargetType="Button">
    <Style.Triggers>
        <MultiTrigger>
            <MultiTrigger.Conditions>
                <Condition Property="IsPressed" Value="True" />
                <Condition Property="Background" Value="BlanchedAlmond" />
            </MultiTrigger.Conditions>
            <MultiTrigger.Setters>
                <Setter Property="Foreground" Value="Blue" />
                <Setter Property="BorderThickness" Value="5" />
                <Setter Property="BorderBrush" Value="Blue" />
            </MultiTrigger.Setters>
        </MultiTrigger>
    </Style.Triggers>
</Style>

// Grid Col Row
<Trigger Property="TabStripPlacement" Value="Left">
	<Setter TargetName="headerPanel" Property="Grid.Row" Value="0" />
	<Setter TargetName="contentPanel" Property="Grid.Row" Value="0" />
	<Setter TargetName="headerPanel" Property="Grid.Column" Value="0" />
	<Setter TargetName="contentPanel" Property="Grid.Column" Value="1" />
	<Setter TargetName="ColumnDefinition0" Property="Width" Value="Auto" />
	<Setter TargetName="ColumnDefinition1" Property="Width" Value="*" />
	<Setter TargetName="RowDefinition0" Property="Height" Value="*" />
	<Setter TargetName="RowDefinition1" Property="Height" Value="0" />
</Trigger>


```

Keys: DataTemplate、DataTrigger、MultiDataTrigger

```xaml
<DataTemplate.Triggers>
    <DataTrigger Binding="{Binding Path=Picture}" Value="{x:Null}">
        <Setter TargetName="viewImage" Property="Source" Value="/Images/noImage.png"/>
        ……
    </DataTrigger>
</DataTemplate.Triggers>

<DataTemplate.Triggers>
    <MultiDataTrigger>
        <MultiDataTrigger.Conditions>
            <Condition Binding="{Binding Path=Picture}" Value="{x:Null}" />
            <Condition Binding="{Binding Path=Title}" Value="Waterfall" />
        </MultiDataTrigger.Conditions>
        <MultiDataTrigger.Setters>
           <Setter TargetName="viewImage" Property="Source" Value="/Images/noImage.png"/>
           <Setter TargetName="viewImage" Property="Opacity" Value="0.5" />
           <Setter TargetName="viewText" Property="Background" Value="Brown" />
        </MultiDataTrigger.Setters>
    </MultiDataTrigger>
</DataTemplate.Triggers> 
```

Keys: Style、Setter、DataTrigger、Binding

```xaml
// 注: 内联属性 优先级最大， Trigger 里面的优先级没它高，所以属性设置放在 Setter 中
<Style TargetType="{x:Type TextBlock}">
	<Setter Property="Text" Value="❌" />
	<Setter Property="Foreground" Value="Red" />
	<Style.Triggers>
		<DataTrigger Binding="{Binding Path=IsSafe, TargetNullValue=False}" Value="True">
			<Setter Property="Text" Value="✔" />
			<Setter Property="Foreground" Value="Green" />
		</DataTrigger>
	</Style.Triggers>
</Style>

<DataTrigger Binding="{Binding Path=SpecialFeatures}">
	<DataTrigger.Value>
		<src:SpecialFeatures>Color</src:SpecialFeatures>
	</DataTrigger.Value>
	<DataTrigger.Setters>
		<Setter Property="BorderBrush" Value="DodgerBlue" TargetName="border" />
		<Setter Property="Foreground" Value="Navy" TargetName="descriptionTitle" />
		<Setter Property="Foreground" Value="Navy" TargetName="currentPriceTitle" />
		<Setter Property="BorderThickness" Value="3" TargetName="border" />
		<Setter Property="Padding" Value="5" TargetName="border" />
	</DataTrigger.Setters>
</DataTrigger>
```

Keys: MultiTrigger、AttachProperty

```xaml
<MultiTrigger>
	<MultiTrigger.Conditions>
		<Condition Property="IsFocused" Value="False" />
		<Condition Property="helper:PasswordBoxHelper.Password" Value="" />
	</MultiTrigger.Conditions>
	<Setter TargetName="PART_Watermark" Property="Visibility" Value="Visible" />
</MultiTrigger>
```

Keys: EventTrigger

```xaml
// EventTrigger(事件触发器)
<Border>
    <Border.Triggers>
        <EventTrigger RoutedEvent="Mouse.MouseEnter">
            <BeginStoryboard>
                <Storyboard>
                    <ColorAnimation Duration="0:0:1" Storyboard.TargetName="MyBorder" 
                                    Storyboard.TargetProperty="Color" To="Gray" />
                </Storyboard>
            </BeginStoryboard>
        </EventTrigger>
    </Border.Triggers>
</Border>
```



### Resource

Keys: ComponentResourceKey

```xaml
// Generic.xaml
<ImageBrush
	x:Key="{ComponentResourceKey {x:Type local:CustomTheme},
								 DogBrushKey}"
	ImageSource="/WPF.Common;component/Assets/Images/dog.png"
	Opacity="0.3"
	TileMode="Tile"
	Viewport="0 0 32 32"
	ViewportUnits="Absolute" />

// CustomTheme.cs
public class CustomTheme
{
	public static ComponentResourceKey DogBrushKey
	{
		get { return new ComponentResourceKey(typeof(CustomTheme), nameof(DogBrushKey)); }
	}
}

// MainWindow.xaml
<Button
	Margin="5"
	Padding="5"
	Background="{DynamicResource {x:Static comt:CustomTheme.DogBrushKey}}"
	Content="Dog"
	FontSize="22"
	FontWeight="Bold"
	Foreground="Green" />
```



Keys: SystemColors

```xaml
this.Background = (Brush) this.FindResource(SystemColors.ControlBrushKey);

<Grid Background="{DynamicResource {x:Static SystemColors.ControlBrushKey}}"/>
```

Keys: MergedDictionaries、ResourceDictionary

```c#
static ResourceDictionary greenSkin;
static ResourceDictionary blueSkin;

void EnsureSkins()
{
	// this method is called each time a new Window1 is constructed,
	// so make sure we only load the resources the first time
	greenSkin = new ResourceDictionary();
	greenSkin.Source = new Uri("GreenSkin.xaml", UriKind.Relative);
	blueSkin = new ResourceDictionary();
	blueSkin.Source = new Uri("BlueSkin.xaml", UriKind.Relative);
}

 void ApplySkin(ResourceDictionary newSkin)
{
	Collection<ResourceDictionary> appMergedDictionaries =
		Application.Current.Resources.MergedDictionaries;

	// remove the old skins (MergedDictionary.Clear won't do the trick)
	if (appMergedDictionaries.Count != 0)
	{
		appMergedDictionaries.Remove(appMergedDictionaries[0]);
	}

	// add the new skin
	appMergedDictionaries.Add(newSkin);
}
```





### RoutedEvent

Keys: RoutedEventHandler、RoutedEventArgs、EventManager

```c#
// 路由事件: 使一个元素可以处理另一个元素引发的事 件，前提是这些元素通过树关系连接在一起
public event RoutedEventHandler CurrentTrackChanged
{
	add { AddHandler(CurrentTrackChangedEvent, value); }
	remove { RemoveHandler(CurrentTrackChangedEvent, value); }
}

public static readonly RoutedEvent CurrentTrackChangedEvent =
	EventManager.RegisterRoutedEvent(nameof(CurrentTrackChanged), RoutingStrategy.Bubble, typeof(RoutedEventHandler), typeof(PositionControl));

// 触发特定路由事件 即 CurrentTrackChangedEvent
CurrentTrackChangedRoutedEventArgs args = new CurrentTrackChangedRoutedEventArgs()
{
	RoutedEvent = CurrentTrackChangedEvent,
	Track = DataContext as Track
};
RaiseEvent(args)
```

```c#
// sample: Control class MouseDoubleClickEvent
public static readonly RoutedEvent MouseDoubleClickEvent;

MouseDoubleClickEvent = EventManager.RegisterRoutedEvent("MouseDoubleClick", RoutingStrategy.Direct, typeof(MouseButtonEventHandler), typeof(Control));

public event MouseButtonEventHandler MouseDoubleClick
{
	add
	{
		AddHandler(MouseDoubleClickEvent, value);
	}
	remove
	{
		RemoveHandler(MouseDoubleClickEvent, value);
	}
}

private static void HandleDoubleClick(object sender, MouseButtonEventArgs e)
{
	if (e.ClickCount == 2)
	{
		Control control = (Control)sender;
		MouseButtonEventArgs mouseButtonEventArgs = new MouseButtonEventArgs(e.MouseDevice, e.Timestamp, e.ChangedButton, e.StylusDevice);
		if (e.RoutedEvent == UIElement.PreviewMouseLeftButtonDownEvent || e.RoutedEvent == UIElement.PreviewMouseRightButtonDownEvent)
		{
			mouseButtonEventArgs.RoutedEvent = PreviewMouseDoubleClickEvent;
			mouseButtonEventArgs.Source = e.OriginalSource;
			mouseButtonEventArgs.OverrideSource(e.Source);
			control.OnPreviewMouseDoubleClick(mouseButtonEventArgs);
		}
		else
		{
			mouseButtonEventArgs.RoutedEvent = MouseDoubleClickEvent;
			mouseButtonEventArgs.Source = e.OriginalSource;
			mouseButtonEventArgs.OverrideSource(e.Source);
			control.OnMouseDoubleClick(mouseButtonEventArgs);
		}
		if (mouseButtonEventArgs.Handled)
		{
			e.Handled = true;
		}
	}
}

protected virtual void OnMouseDoubleClick(MouseButtonEventArgs e)
{
	RaiseEvent(e);
}
```







### Visual/Logical Tree

keys: VisualTree、LogicalTree

```c#
public static List<T> GetChildObjects<T>(DependencyObject obj, Type typename) where T : FrameworkElement
{
	DependencyObject child = null;
	List<T> childList = new List<T>();

	for (int i = 0; i <= VisualTreeHelper.GetChildrenCount(obj) - 1; i++)
	{
		child = VisualTreeHelper.GetChild(obj, i);

		if (child is T && (((T)child).GetType() == typename))
		{
			childList.Add((T)child);
		}
		childList.AddRange(GetChildObjects<T>(child, typename));
	}
	return childList;
}

public static List<T> GetLogicChildObjects<T>(DependencyObject obj, Type typename) where T : FrameworkElement
{
	List<T> childList = new List<T>();
	foreach (var child in LogicalTreeHelper.GetChildren(obj))
	{
		if (child is DependencyObject)
		{
			if (child is T && (((T)child).GetType() == typename))
			{
				childList.Add((T)child);
			}
			childList.AddRange(GetLogicChildObjects<T>(child as DependencyObject, typename));
		}
	}

	return childList;
}


public static List<T> FindVisualChild<T>(DependencyObject obj, Func<T, bool> where = null) where T : DependencyObject
{
	List<T> childList = new List<T>();
	int n = VisualTreeHelper.GetChildrenCount(obj);
	for (int i = 0; i < n; i++)
	{
		DependencyObject child = VisualTreeHelper.GetChild(obj, i);
		if (child is DependencyObject dChild)
		{
			if (child is T tChild && (where == null || where?.Invoke(tChild) == true))
			{
				childList.Add(tChild);
			}
			childList.AddRange(FindVisualChild<T>(dChild, where));
		}
	}
	return childList;
}

```

```c#
 ControlHelper.GetLogicChildObjects<ComboBox>(this, typeof(ComboBox))?.ForEach(t =>
            {
                t.DropDownClosed -= ComboBox_DropDownClosed2;
                t.DropDownClosed += ComboBox_DropDownClosed2;
                t.DropDownOpened -= ComboBox_DropDownOpened;
                t.DropDownOpened += ComboBox_DropDownOpened;
            });

            ControlHelper.GetLogicFisrtChildObject<TreeView>(this, typeof(TreeView))?.ForEach(t =>
            {
                t.PreviewMouseWheel -= TreeView_PreviewMouseWheel;
                t.PreviewMouseWheel += TreeView_PreviewMouseWheel;
            });
```





### VisualStateManager

> 1. VisualState: 视图状态(Visual States)表示控件在一个特殊的逻辑状态下的样式、外观；
> 2. VisualStateGroup: 状态组由**相互排斥**的状态组成，状态组与状态组并不互斥；
> 3. VisualTransition: 视图转变 (Visual Transitions) 代表控件从一个视图状态向另一个**状态转换**时的**过渡**；
> 4. VisualStateManager: 由它负责在代码中来切换到不同的状态；

<img src="Images\visual_state_manager.PNG" style="zoom: 67%;" />

```xaml
<VisualStateManager.VisualStateGroups>
    <VisualStateGroup x:Name="CommonStates">
        <VisualStateGroup.Transitions>
            <VisualTransition GeneratedDuration="0:0:1" To="MouseOver" />
            <VisualTransition GeneratedDuration="0:0:1" To="Pressed" />
            <VisualTransition GeneratedDuration="0:0:1" To="Normal" />
        </VisualStateGroup.Transitions>
        <VisualState x:Name="Normal" />
        <VisualState x:Name="MouseOver">
            <Storyboard>
                <ColorAnimation
                                Storyboard.TargetName="BackgroundBorder"
                                Storyboard.TargetProperty="Background.(SolidColorBrush.Color)"
                                To="#A1D6FC"
                                Duration="0" />
            </Storyboard>
        </VisualState>
        <VisualState x:Name="Pressed">
            <Storyboard>
                <ColorAnimation
                                Storyboard.TargetName="BackgroundBorder"
                                Storyboard.TargetProperty="Background.(SolidColorBrush.Color)"
                                To="#FCA1A1"
                                Duration="0" />
            </Storyboard>
        </VisualState>
    </VisualStateGroup>
</VisualStateManager.VisualStateGroups>
```








### Presenter

Keys：ContentPresenter、ItemsPresenter

```xaml
<ContentControl Content="Content..." ContentStringFormat="This is {0} !">
    <ContentControl.Template>
        <ControlTemplate TargetType="ContentControl">
            <Border BorderBrush="Blue" BorderThickness="1">
                <ContentPresenter />
                <!--<ContentPresenter Content="{TemplateBinding Content}" />-->
            </Border>
        </ControlTemplate>
    </ContentControl.Template>
</ContentControl>

<TreeView.Template>
    <ControlTemplate TargetType="{x:Type TreeView}">
        <Border BorderBrush="Red" BorderThickness="1">
            <ItemsPresenter />
        </Border>
    </ControlTemplate>
</TreeView.Template>
```





### Template

```
1.数据模板 用于从对象中提取数据，在已有控件的内部添加元素（预先构建好的控件内容不能改变），并在内容控件或列表控件的各个项中显示数据,在数据绑定中，数据模板非常有用
2.控件模板 一种更激进的方法，允许完全重写控件的内容模型
3.面板模板 用于控制列表控件(继承自 ItemsControl 类的控件)中各项的布局
```



#### ControlTemplate	

Keys：ListViewItem、ControlTemplate.Triggers、TargetName

Note: 指定控件的外观和行为

~~~xaml
<Style x:Key="ItemContStyle" TargetType="ListViewItem">
	<Setter Property="Template">
		<Setter.Value>
			<ControlTemplate TargetType="{x:Type ListViewItem}">
				<Border Name="BD_Collector">
					<TextBlock Text="{Binding Name}" Margin="20,0,0,0"
							   VerticalAlignment="Center" FontSize="12" />
				</Border>
				<ControlTemplate.Triggers>
					<Trigger Property="IsMouseOver" Value="True">
						<Setter TargetName="BD_Collector" Property="Background" Value="#f1f1f1" />
					</Trigger>
					<Trigger Property="IsSelected" Value="True">
						<Setter TargetName="BD_Collector" Property="Background" Value="#376BFA" />
						<Setter Property="Foreground" Value="White" />
						<Setter Property="BorderBrush" Value="White" />
					</Trigger>
				</ControlTemplate.Triggers>
			</ControlTemplate>
		</Setter.Value>
	</Setter>
</Style>

<Button>
	<Button.Template>
		<ControlTemplate TargetType="{x:Type Button}">
			<Border x:Name="border" Background="{TemplateBinding Background}">
				<Image
					x:Name="imgBtn"
					Cursor="Hand"
					Source="/Resource/images/basis_normal.png" />
			</Border>
			<ControlTemplate.Triggers>
				<Trigger Property="IsMouseOver" Value="True">
					<Setter Property="Background" Value="#394867" />
					<Setter TargetName="imgBtn" Property="Source" Value="/Resource/images/basis_hover.png" />
				</Trigger>
			</ControlTemplate.Triggers>
		</ControlTemplate>
	</Button.Template>
</Button>
~~~

- Keys：ItemContainerStyle、ListBoxItem

~~~xaml
<dxe:ListBoxEdit.ItemContainerStyle>
	<Style TargetType="ListBoxItem">
		<Style.Triggers>
			<Trigger Property="IsSelected" Value="True">
				<Setter Property="Background" Value="Transparent"/>
			</Trigger>
		</Style.Triggers>
	</Style>
</dxe:ListBoxEdit.ItemContainerStyle>
~~~

- Keys：ContentPresenter

~~~xaml
<ControlTemplate x:Key="HeaderTemplate" TargetType="{x:Type Label}">
	<Canvas Background="#C40D42" >
		<Image Height="56" Canvas.Left="0" Canvas.Top="0" Stretch="UniformToFill" Source=".\Images\Banner.png"/>
		<ContentPresenter Canvas.Right="10" Canvas.Top="25" Content="{TemplateBinding Content}" />
	</Canvas>
</ControlTemplate>
<Style x:Key="HeaderLabelStyle" TargetType="Label">
	<Setter Property="Template" Value="{StaticResource HeaderTemplate}" />
	<Setter Property="FontFamily" Value="Times New Roman" />
	<Setter Property="FontSize" Value="24" />
	<Setter Property="FontWeight" Value="Bold" />
	<Setter Property="Foreground" Value="#FFF7EFEF" />
</Style>
~~~

- Keys: TemplatePart、OnApplyTemplate、FindName

~~~c#
// 自定义控件 .cs 与 .xmal 代码交互
[TemplatePart(Name = PART_CloseButton, Type = typeof(PopupWindow))]
public class PopupWindow : Window
{
	private const string PART_CloseButton = "PART_CloseButton";

	static PopupWindow()
	{
		DefaultStyleKeyProperty.OverrideMetadata(typeof(PopupWindow), 
			new FrameworkPropertyMetadata(typeof(PopupWindow)));
	}

	public override void OnApplyTemplate()
	{
		base.OnApplyTemplate();
		
		(Template.FindName(PART_CloseButton, this) as Button).Click += (s, args) => Close();
	}
}
~~~




#### DataTemplate

Note: 指定控件内容的外观 ，组合绑定对象的多个属性，定义如何显示绑定的数据对象

Keys: ItemTemplate、DataTemplate.Triggers、TargetName



```xaml
<dxe:ListBoxEdit.ItemTemplate>
	<DataTemplate>
		<StackPanel x:Name="pal">
			<CheckBox x:Name="chk" IsChecked="{Binding IsChecked}" />
		</StackPanel>
		<DataTemplate.Triggers>
			<DataTrigger Binding="{Binding ElementName=chk, Path=IsChecked}" Value="true">
				<Setter TargetName="pal" Property="Background" Value="#EEF7FF" />
			</DataTrigger>
		</DataTemplate.Triggers>
	</DataTemplate>
</dxe:ListBoxEdit.ItemTemplate>
```

#### HierarchicalDataTemplate

Note: `DataTemplate` 用于定义如何呈现单个数据项，而 `HierarchicalDataTemplate` 用于定义如何呈现具有层次结构的数据

#### ItemsPanelTemplate

Keys: ItemsPanelTemplate



### ValidationRule

- Keys：Validation.ErrorTemplate、ValidatesOnExceptions、ValidatesOnDataErrors、NotifyOnValidationError、Validation.Errors、ValidationAttribute、IDataErrorInfo

~~~xaml
[ValueValidation]    // public  class ValueValidation : ValidationAttribute
[Required(ErrorMessage = "空，提示：必填《trans0067》")]
[StringLength(255, ErrorMessage = "[密码]内容最大允许255个字符！")]
[RegularExpression("^([0-4][0-9]|50)$|^(-[0-4][0-9]|-50)$", ErrorMessage = "输入框：-50到50，整数")]

1.ExceptionValidationRule 检查在绑定源属性更新期间引发的异常。 
	在以上示例中， StartPrice 为整数类 型。 当用户输入的值无法转换为整数时，将引发异常，这会导致将绑定标记为无效。 用于显式设置 ExceptionValidationRule 的替代语法是在 Binding 或 MultiBinding 对象上将 ValidatesOnExceptions 属性 设置为 true 。 
2. DataErrorValidationRule 对象检查实现 IDataErrorInfo 接口的对象所引发的错误。 有关使用此验证规则的 详细信息，请参阅 DataErrorValidationRule。 
	用于显式设置 DataErrorValidationRule 的替代语法是在 Binding 或 MultiBinding 对象上将 ValidatesOnDataErrors 属性设置为 true 。
3.通过从 ValidationRule 类派生并实现 Validate 方法来创建自己的验证规则。 以下示例演示了 什么是数据 绑定部分中 添加产品清单“起始日期”TextBox 所用的规则。

Validation.GetErrors(...)
(Validation.Errors).CurrentItem.ErrorContent
(Validation.Errors)[0].ErrorContent

~~~

Keys: Validation.ErrorTemplate

~~~xaml
<Style TargetType="{x:Type TextBox}">
    <Setter Property="Validation.ErrorTemplate">
        <Setter.Value>
            <ControlTemplate>
                <DockPanel LastChildFill="True">
                    <!--<TextBlock DockPanel.Dock="Bottom" Foreground="Red"
           Text="{Binding ElementName=adorned,Path=AdornedElement.(Validation.Errors)[0].ErrorContent}"/>-->
                    <Border BorderBrush="Transparent" BorderThickness="1" ToolTip="{Binding ElementName=adorned,Path=AdornedElement.(Validation.Errors)[0].ErrorContent}">
                        <AdornedElementPlaceholder x:Name="adorned"/>
                    </Border>
                </DockPanel>
            </ControlTemplate>
        </Setter.Value>
    </Setter>
</Style>
// Notify
<Border  
        ToolTip="{Binding RelativeSource={x:Static RelativeSource.Self},
                 Path=(Validation.Errors)[0].ErrorContent}"
        Tag="{Binding ExpectedPowerModel.Value,Mode=TwoWay,
             UpdateSourceTrigger=PropertyChanged,
             ValidatesOnExceptions=True,
             ValidatesOnDataErrors=True,
             NotifyOnValidationError=True}"/>
~~~

Keys: ValueValidationRule、Binding.ValidationRules

```c#
public class ValueValidationRule : ValidationRule
{
    // value:绑定的交互数据
    // 返回：状态，消息内容 
    public override ValidationResult Validate(object value, CultureInfo cultureInfo)
    {
        if (value == null || string.IsNullOrEmpty(value.ToString()))
        {
            return new ValidationResult(false, "数据不能为空");
        }
        if (value.ToString() == "100")
        {
            // 数据库检索/从缓存数据
            return new ValidationResult(false, "数据不能重复，请重新输入[ValidationRule]");
        }
        return new ValidationResult(true, "");
    }
}
```

```xaml
<TextBox Template="{StaticResource ValidTextBoxTemp}" Validation.ErrorTemplate="{StaticResource TextBoxErrorTemplate}">
    <TextBox.Text>
        <Binding Path="Values.Value" UpdateSourceTrigger="PropertyChanged">
            <Binding.ValidationRules>
                <!--<ExceptionValidationRule/>-->
                <local:ValueValidationRule />
            </Binding.ValidationRules>
        </Binding>
    </TextBox.Text>
</TextBox>
```





~~~c#
// ValidationAttribute
class ValueValidation : ValidationAttribute
{
    public override bool IsValid(object value)
    {
        if (value == null || string.IsNullOrEmpty(value.ToString()))
        {
            ErrorMessage = "空，提示：必填《trans0067》";
            return false;
        }
        else
        {
            string pattern = @"^([0-4][0-9]|50)$|^(-[0-4][0-9]|-50)$";
            Match match = Regex.Match(value.ToString(), pattern);
            if (!match.Success)
            {
                ErrorMessage = "输入框：-50到50，整数";
                return false;
            }
            else
            {
                ErrorMessage = string.Empty;
                return true;
            }
        }
    }

    public override string FormatErrorMessage(string name)
    {
        return ErrorMessage;
    }
}
~~~



### DependencyObject

依赖属性是给自己用的，附加属性是给别人用的

#### DependencyProperty

Keys: DependencyProperty(依赖属性)、Register、PropertyMetadata、PropertyChangedCallbackHandler、CoerceValueCallbackHandler、ValidateValueCallbackHandler

~~~c#
// DependencyProperty: 封装数据，作用于动画、样式、绑定...
// ValidateValueCallback:	检查 属性值
// CoerceValueCallback: 	检查、强制赋值
// PropertyChangedCallback: 属性值变更回调
/* 输入数据，经过 ValidateValueCallback 进行数据验证，验证通过后，
在经过  CoerceValueCallback 进行数据转换，数据更改后，最后对应的
属性变更回调方法 PropertyChangedCallback */

public int MyAge
{
	get { return (int)GetValue(MyAgeProperty); }
	set { SetValue(MyAgeProperty, value); }
}

public static int DefaultAge = 18;

// 用于MyProperty的封装数据，它可以作用于动画，样式，绑定等等......
// Using a DependencyProperty as the backing store for MyProperty.  This enables animation, styling, binding, etc..
public static readonly DependencyProperty MyAgeProperty =
	DependencyProperty.Register("MyAge", typeof(int), typeof(Window), new PropertyMetadata(18, PropertyChangedCallbackHandler, CoerceValueCallbackHandler), ValidateValueCallbackHandler);

// 验证
private static bool ValidateValueCallbackHandler(object value)
{
	if (value is int iValue)
	{
		if (iValue > 100 || iValue < DefaultAge)
		{
			MessageBox.Show($"年龄 {iValue} 不在允许范围中！");
		}
	}
	return true;
}

// 强制转换
private static object CoerceValueCallbackHandler(DependencyObject d, object baseValue)
{
	if (baseValue is int iValue)
	{
		return iValue > 100 || iValue < DefaultAge ? DefaultAge : iValue;
	}
	else
	{
		return false;
	}
}

// 属性变更
private static void PropertyChangedCallbackHandler(DependencyObject d, DependencyPropertyChangedEventArgs e)
{
	if (d is Window win)
	{
		var txt = win?.FindName("TestTextBox") as TextBox;
		txt.BorderBrush = Brushes.GreenYellow;
	}
}
~~~



#### AttachedProperty

Keys: DependencyObject、GetValue、SetValue

```c#
public class ContentTypeDpObj : DependencyObject
{
	/// <summary>
	/// 获取附加属性
	/// </summary>
	/// <param name="d"></param>
	/// <returns></returns>
	public static Type GetContentType(DependencyObject d)
	{
		return (Type)d.GetValue(ContentTypeProperty);
	}

	/// <summary>
	/// 设置附加属性
	/// </summary>
	/// <param name="d"></param>
	/// <param name="value"></param>
	public static void SetContentType(DependencyObject d, Type value)
	{
		d.SetValue(ContentTypeProperty, value);
	}
	// Using a DependencyProperty as the backing store for ContentType.  This enables animation, styling, binding, etc...
	public static readonly DependencyProperty ContentTypeProperty =
		DependencyProperty.Register("ContentType", typeof(Type), typeof(ContentTypeDpObj), new FrameworkPropertyMetadata(null, new PropertyChangedCallback(OnPropertyChanged)));

	private static void OnPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
	{
	}
}

public MainVM()
{
	navigateCmd = new RelayCommand<object>((para) =>
	{
		Type type = GetContentType(para);
		ConstructorInfo cti = type.GetConstructor(Type.EmptyTypes);
		this.MainContent = (FrameworkElement)cti.Invoke(null);

	}, (para) => true);

	NavigateCmd.Execute(typeof(HomePage));
}

private Type GetContentType(object para)
{
	Type type = null;
	if (para is Type)
	{
		type = para as Type;
	}
	else if (para is RadioButton rabtn)
	{
		// 获取 依赖对象 的 附加属性
		// var ss  = rabtn.GetValue(ContentTypeDp.ContentTypeProperty);
		type = ContentTypeDpObj.GetContentType(rabtn);
	}
	return type;
}
```



```xaml
<RadioButton
	common:ContentTypeDpObj.ContentType="{x:Type vm:HomePage}"
	Command="{Binding NavigateCmd}"
	CommandParameter="{Binding RelativeSource={RelativeSource Mode=Self}}"
	Content="Home"
	IsChecked="True"
	Style="{DynamicResource RadioBtnStyle.Navigation}" />
<RadioButton
	common:ContentTypeDpObj.ContentType="{x:Type vm:CenterPage}"
	Command="{Binding NavigateCmd}"
	CommandParameter="{Binding RelativeSource={RelativeSource Mode=Self}}"
	Content="Center"
	Style="{DynamicResource RadioBtnStyle.Navigation}" />
<RadioButton
	common:ContentTypeDpObj.ContentType="{x:Type vm:SettingPage}"
	Command="{Binding NavigateCmd}"
	CommandParameter="{Binding RelativeSource={RelativeSource Mode=Self}}"
	Content="Setting"
	Style="{DynamicResource RadioBtnStyle.Navigation}" />
```



```xaml
namespace GTS.MaxSign.Controls.Assets.Components
{
    public class ComboBoxHelper : DependencyObject
    {
        public static readonly DependencyProperty UnitProperty =
            DependencyProperty.RegisterAttached("Unit", typeof(string), typeof(ComboBoxHelper), new FrameworkPropertyMetadata("", new PropertyChangedCallback(Unit_OnPropertyChanged)));

        public static string GetUnit(DependencyObject d)
        {
            return d.GetValue(UnitProperty).ToString();
        }
        public static void SetUnit(DependencyObject d, string value)
        {
            d.SetValue(UnitProperty, value);
        }
        private static void Unit_OnPropertyChanged(DependencyObject d, DependencyPropertyChangedEventArgs e)
        {
            string unit = d.GetValue(UnitProperty).ToString();
        }
    }
}

<ComboBox  com:ComboBoxHelper.Unit="MHz"/>
<TextBlock Text="{DXBinding '$com:ComboBoxHelper.GetUnit(@p)'}" /> 

```

Keys: TemplateBinding

```xaml
<TextBox
	x:Name="TrainNoBox"
	Width="62"
	Height="16"
	helper:TextBoxHelper.GotFocusedIgnoreBinding="True"
	helper:WatermarkHelper.Watermark="请输入"
	helper:WatermarkHelper.WatermarkBrush="#99AFCC"
	Background="Transparent"
	BorderThickness="0"
	CaretBrush="#99AFCC"
	DataContext="{Binding}"
	FontSize="10"
	Foreground="#99AFCC"
	Style="{StaticResource WatermarkTextBoxStyle}"
	Text="{Binding Trains[0].No}"
	TextAlignment="Center" />
	

<Style x:Key="WatermarkTextBoxStyle" TargetType="{x:Type TextBox}">
	<Setter Property="VerticalContentAlignment" Value="Center" />
	<Setter Property="Template">
		<Setter.Value>
			<ControlTemplate TargetType="{x:Type TextBox}">
				<Border
					Width="{TemplateBinding Width}"
					Height="{TemplateBinding Height}"
					Background="{TemplateBinding Background}"
					BorderBrush="{TemplateBinding BorderBrush}"
					BorderThickness="{TemplateBinding BorderThickness}"
					CornerRadius="{TemplateBinding Property=helper:CornerRadiusHelper.CornerRadius}">
					<Grid Margin="{TemplateBinding Padding}">
						<TextBlock
							x:Name="PART_Watermark"
							VerticalAlignment="{TemplateBinding VerticalContentAlignment}"
							FontSize="{TemplateBinding FontSize}"
							Foreground="{TemplateBinding Property=helper:WatermarkHelper.WatermarkBrush}"
							Text="{TemplateBinding Property=helper:WatermarkHelper.Watermark}"
							Visibility="Collapsed" />
						<ScrollViewer x:Name="PART_ContentHost" VerticalAlignment="{TemplateBinding VerticalContentAlignment}" />
					</Grid>
				</Border>
				<ControlTemplate.Triggers>
					<MultiTrigger>
						<MultiTrigger.Conditions>
							<Condition Property="IsFocused" Value="False" />
							<Condition Property="Text" Value="" />
						</MultiTrigger.Conditions>
						<Setter TargetName="PART_Watermark" Property="Visibility" Value="Visible" />
					</MultiTrigger>
				</ControlTemplate.Triggers>
			</ControlTemplate>
		</Setter.Value>
	</Setter>
</Style>
```



### Geometry

Keys:RectangleGeometry、EllipseGeometry、LineGeometry、PathGeometry

### Visual

Keys:DrawingVisual

```xaml
<TextBox
	BorderBrush="{x:Null}"
	BorderThickness="0"
	Foreground="Orange">
	<TextBox.Resources>
		<VisualBrush
			x:Key="HelpBrush"
			AlignmentX="Left"
			Opacity="0.3"
			Stretch="None"
			TileMode="None">
			<VisualBrush.Visual>
				<TextBlock
					Padding="10,0,0,0"
					VerticalAlignment="Center"
					FontStyle="Normal"
					Foreground="White"
					Text="请选择" />
			</VisualBrush.Visual>
		</VisualBrush>
	</TextBox.Resources>
	<TextBox.Style>
		<Style TargetType="TextBox">
			<Setter Property="Background" Value="Transparent"/>
			<Style.Triggers>
				<Trigger Property="Text" Value="{x:Null}">
					<Setter Property="Background" Value="{StaticResource HelpBrush}" />
				</Trigger>
				<Trigger Property="Text" Value="">
					<Setter Property="Background" Value="{StaticResource HelpBrush}" />
				</Trigger>
			</Style.Triggers>
		</Style>
	</TextBox.Style>
</TextBox>
```

### Brush

| 名称                | 说明                                                         |
| ------------------- | ------------------------------------------------------------ |
| SolidColorBrush     |                                                              |
| LinearGradientBrush |                                                              |
| ImageBrush          |                                                              |
| DrawingBrush        | 使用 Drawing 对象绘制区域，该对象可以包含已经定义的形状和位图 |
| VisualBrush         |                                                              |
| BitmapCacheBrush    | 使用从 Visual 对象缓存的内容绘制区域。这种画刷和 VisuaBrush 类似，但如果需要在多个地方重用图形内容或者频繁地重绘图形内容，这种画刷更高效 |

Keys：SolidColorBrush、ColorConverter LinearGradientBrush

~~~C#
new SolidColorBrush(Color.FromArgb(0xFF, 0x36, 0xBF, 0x56));
new SolidColorBrush((Color)ColorConverter.ConvertFromString("#EEF7FF"));

LinearGradientBrush 
	StartPoint(x,y)	Default:(0,0)
	EndPoint (x,y)	Default:(1,1)
~~~

### Path

Keys: Geometry

|                   |                                                              |
| ----------------- | ------------------------------------------------------------ |
| LineGeometry      |                                                              |
| RectangleGeometry |                                                              |
| EllipseGeometry   |                                                              |
| GeometryGroup     | 为单个路径添加任意多个 Geometry 对象，使用 EvenOdd 或 NonZero 填充规则来确定要填充的区域 |
| CombinedGeometry  | 将两个几何图形合并为一个形状。可使用 CombineMode 属性选择如何组合两个几何图形 |
| PathGcomctry      |                                                              |
| StreamGeometry    |                                                              |

Keys: PathSegment

|                            |      |
| -------------------------- | ---- |
| LineSegment                |      |
| ArcSegment                 |      |
| BezierSegment              |      |
| QuadraticBezierSegment     |      |
| PolyLineSegment            |      |
| PolyBezierSegment          |      |
| PolyQuadraticBezierSegment |      |

Keys: F n、M x,y、Z、L x,y、A rx,ry,d f1(IsLargeArc) f2(Clockwise) x,y、C x1,y1 x2,y2 x,y、Q x1,y1 x,y、H x、V y、S x2,y2 x,y、DashStyle

微语言图形命令

| 名称                                                         | 说明                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| F value                                                      | 设置 Geometry.FillRule 属性。0 表示 EvenOdd，1 表示 NonZero。如果决定使用该命令，就必须将该命令放在字符串的开头 |
| M x,y                                                        | Move                                                         |
| L x,y                                                        | LineSegment                                                  |
| H x                                                          | LineSegment                                                  |
| V y                                                          | LineSegment                                                  |
| A radiusX,radiusY <br />degress isLargeArc,<br />isClockwise x,y | ArgSegment,指定描述弧线的圆半径、弧线旋转的度数...           |
| Z                                                            | 结束当前 PathFigure 对象，并将 IsClosed 属性设置为 true。如果不希望将 IsClosed属性设置为 true,就不必使用该命令，如果希望开始一个新的 PathFigure 对象或结束字符串，只需使用 M 命令 |
| 小写                                                         | 如果希望命令的参数值相对于前一个点，而不是使用绝对坐标进行计算，可使用小写的命令 |

### Drawing

Keys: Drawing

|                 |      |
| --------------- | ---- |
| GeometryDrawing |      |
| ImageDrawing    |      |
| VideoDrawing    |      |
| GlyphRunDrawing |      |
| DrawingGroup    |      |

| 类            | 父类        | 说明                                                         |
| ------------- | ----------- | ------------------------------------------------------------ |
| DrawingImage  | ImageSource | 允许在 Image 元素中驻留图画                                  |
| DrawingBrush  | Brush       | 允许使用画刷封装图画，之后就可以用画刷绘制任何表面           |
| DrawingVisual | Visual      | 允许在低级的可视化对象中放置图画。可视化对象并不具有真正元素的开销，但是如果实现了需要的基础结构，那么仍可以显示可视化对象 |

### Effect

|                  |                                                              |
| ---------------- | ------------------------------------------------------------ |
| BlurEffect       | 模糊元素中的内容                                             |
| DropShadowEffect | 在元素背后添加矩形阴影                                       |
| ShaderEffect     | 应用像素着色器，像索着色器是使用高级着色语言(High Level Shading Language,HLSL)事先制作好的并且已经编译过的效果 |



### Line

Keys：Stroke、StrokeDashArray、StrokeThickness、VisualBrush、StrokeStartLineCap/StrokeEndLineCap

~~~xaml
 StrokeDashArray 线宽占比，例：10,3: 实线的长度占比 10%,空白间隙的长度 占比 3%
 RadiusX和RadiusY属性需要联合使用表示角的角度，单独设置不生效，RadiusX表示X轴方向角的弯曲度，RadiusY表示Y轴方向的弯曲度。
 StrokeDashCap属性用于设置虚线的时候，虚线段开除的形状，无虚线不生效
 StrokeDashOffset表示破折号开始的距离，偏移量
 StrokeEndLineCap设置开始或结束处的形状，闭合曲线无效
 StrokeMiterLimit斜接长度与笔画厚度之比的极限。这个值总是大于等于1的正数。

<Border>
	<!--Border.BorderBrush>
		<VisualBrush>
			<VisualBrush.Visual>
				<Rectangle
					Width="{Binding RelativeSource={RelativeSource AncestorType={x:Type Border}}, Path=ActualWidth}"
					Height="{Binding RelativeSource={RelativeSource AncestorType={x:Type Border}}, Path=ActualHeight}"
					Stroke="#D2D2D2"
					StrokeDashArray="4"
					StrokeThickness="0.8" />
			</VisualBrush.Visual>
		</VisualBrush>
	</Border.BorderBrush>-->
	<Line
		Stroke="#D2D2D2"
		StrokeDashArray="10,3"
		StrokeThickness="1"
		X1="0"
		X2="{Binding RelativeSource={RelativeSource AncestorType={x:Type Border}}, Path=ActualWidth}"
		Y1="1"
		Y2="1" />
</Border>
~~~



​    

### Window

SizeToContent="WidthAndHeight"

Keys: Window Style

~~~xaml
<Style x:Key="WindowStyle.Aero" TargetType="{x:Type Window}">
	<EventSetter Event="Loaded" Handler="Window_Loaded" />
	<Setter Property="WindowStyle" Value="None" />
	<Setter Property="AllowsTransparency" Value="True" />
	<Setter Property="BorderThickness" Value="2" />
	<Setter Property="Height" Value="650" />
	<Setter Property="Width" Value="960" />
	<Setter Property="Foreground" Value="White" />
	<Setter Property="Background" Value="#FF007ACC" />
	<Setter Property="BorderBrush" Value="Chocolate" />
	<Setter Property="Template">
		<Setter.Value>
			<ControlTemplate TargetType="{x:Type Window}">
				<Border
					x:Name="windowBorder"
					BorderBrush="{TemplateBinding BorderBrush}"
					BorderThickness="{TemplateBinding BorderThickness}">
					<Grid Background="Transparent">

						<!--  窗口主体  -->
						<Grid Margin="0,36,0,0">
							<ContentPresenter
								Content="{TemplateBinding Content}"
								ContentStringFormat="{TemplateBinding ContentStringFormat}"
								ContentTemplate="{TemplateBinding ContentTemplate}" />
						</Grid>

						<!--  标题栏  -->
						<Border
							Height="36"
							VerticalAlignment="Top"
							Panel.ZIndex="9999"
							Background="{TemplateBinding Background}"
							MouseLeftButtonDown="Title_MouseLeftButtonDown">

							<Grid>
								<TextBlock
									HorizontalAlignment="Center"
									VerticalAlignment="Center"
									FontSize="16"
									Foreground="{TemplateBinding Foreground}"
									Text="{TemplateBinding Title}"
									TextAlignment="Center" />
								<StackPanel
									HorizontalAlignment="Right"
									ButtonBase.Click="WindowStateButton_Click"
									Orientation="Horizontal">
									<StackPanel.Resources>
										<Style x:Key="ButtonStyle.WindowControl" TargetType="{x:Type Button}">
											<Setter Property="Width" Value="40" />
											<Setter Property="Height" Value="36" />
											<Setter Property="Background" Value="Transparent" />
											<Setter Property="BorderBrush" Value="Transparent" />
											<Setter Property="Template">
												<Setter.Value>
													<ControlTemplate TargetType="{x:Type Button}">
														<Border
															x:Name="border"
															Background="{TemplateBinding Background}"
															BorderBrush="{TemplateBinding BorderBrush}"
															BorderThickness="{TemplateBinding BorderThickness}"
															SnapsToDevicePixels="true">
															<ContentPresenter
																x:Name="contentPresenter"
																Margin="{TemplateBinding Padding}"
																HorizontalAlignment="{TemplateBinding HorizontalContentAlignment}"
																VerticalAlignment="{TemplateBinding VerticalContentAlignment}"
																Focusable="False"
																RecognizesAccessKey="True"
																SnapsToDevicePixels="{TemplateBinding SnapsToDevicePixels}" />
														</Border>
														<ControlTemplate.Triggers>
															<Trigger Property="IsMouseOver" Value="true">
																<Setter TargetName="border" Property="Background" Value="Chocolate" />
															</Trigger>
														</ControlTemplate.Triggers>
													</ControlTemplate>
												</Setter.Value>
											</Setter>
										</Style>

										<Style
											x:Key="ButtonStyle.WindowClose"
											BasedOn="{StaticResource ButtonStyle.WindowControl}"
											TargetType="{x:Type Button}">
											<Setter Property="Template">
												<Setter.Value>
													<ControlTemplate TargetType="{x:Type Button}">
														<Border
															x:Name="border"
															Background="{TemplateBinding Background}"
															BorderBrush="{TemplateBinding BorderBrush}"
															BorderThickness="{TemplateBinding BorderThickness}"
															SnapsToDevicePixels="true">
															<ContentPresenter
																x:Name="contentPresenter"
																Margin="{TemplateBinding Padding}"
																HorizontalAlignment="{TemplateBinding HorizontalContentAlignment}"
																VerticalAlignment="{TemplateBinding VerticalContentAlignment}"
																Focusable="False"
																RecognizesAccessKey="True"
																SnapsToDevicePixels="{TemplateBinding SnapsToDevicePixels}" />
														</Border>
														<ControlTemplate.Triggers>
															<Trigger Property="IsMouseOver" Value="true">
																<Setter TargetName="border" Property="Background" Value="Red" />
															</Trigger>
														</ControlTemplate.Triggers>
													</ControlTemplate>
												</Setter.Value>
											</Setter>
										</Style>

										<Style x:Key="PathStyle.WindowControl" TargetType="{x:Type Path}">
											<Setter Property="Width" Value="30" />
											<Setter Property="Height" Value="30" />
											<Setter Property="StrokeThickness" Value="2" />
										</Style>
									</StackPanel.Resources>

									<!--  最小化  -->
									<Button Style="{StaticResource ButtonStyle.WindowControl}" Tag="Minimize">
										<Path Stroke="{TemplateBinding Foreground}" Style="{StaticResource PathStyle.WindowControl}">
											<Path.Data>M10, 15 L20, 15</Path.Data>
										</Path>
									</Button>

									<!--  最大化  -->
									<Button Style="{StaticResource ButtonStyle.WindowControl}" Tag="Maximize">
										<Path Stroke="{TemplateBinding Foreground}" Style="{StaticResource PathStyle.WindowControl}">
											<!--  M为第一个点，最后加Z代表图形自动封闭起始点  -->
											<Path.Data>M10, 10 L20, 10 L20, 20 L10, 20Z</Path.Data>
										</Path>
									</Button>

									<!--  关闭  -->
									<Button Style="{StaticResource ButtonStyle.WindowClose}" Tag="Close">
										<Path Stroke="{TemplateBinding Foreground}" Style="{StaticResource PathStyle.WindowControl}">
											<Path.Data>
												<GeometryGroup>
													<LineGeometry StartPoint="10,10" EndPoint="20,20" />
													<LineGeometry StartPoint="20,10" EndPoint="10,20" />
												</GeometryGroup>
											</Path.Data>
										</Path>
									</Button>
								</StackPanel>
							</Grid>
						</Border>

						<!--  缩放手柄  -->
						<Border
							Width="30"
							Height="30"
							HorizontalAlignment="Right"
							VerticalAlignment="Bottom"
							Background="Transparent"
							Cursor="SizeNWSE"
							LostFocus="Border_LostFocus"
							MouseLeftButtonDown="Border_MouseDown"
							MouseLeftButtonUp="Border_MouseUp"
							MouseMove="Border_MouseMove">
							<Path
								Width="30"
								Height="30"
								Stroke="{TemplateBinding Foreground}"
								StrokeThickness="2">
								<Path.Data>
									<GeometryGroup>
										<LineGeometry StartPoint="20, 25" EndPoint="25, 20" />
										<LineGeometry StartPoint="15, 25" EndPoint="25, 15" />
										<LineGeometry StartPoint="10, 25" EndPoint="25, 10" />
									</GeometryGroup>
								</Path.Data>
							</Path>
						</Border>
					</Grid>
				</Border>

			</ControlTemplate>
		</Setter.Value>
	</Setter>
</Style>
~~~



```c#
using System.Diagnostics;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace CustomDashboard.Asserts.Style
{

    public partial class StyleWindow : ResourceDictionary
    {
        public StyleWindow()
        {
            InitializeComponent();
        }


        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            Window win = sender as Window;
        }

        private void Title_MouseLeftButtonDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (((FrameworkElement)sender).TemplatedParent is Window self)
                self.DragMove();
        }

        private void WindowStateButton_Click(object sender, RoutedEventArgs e)
        {
            if (((FrameworkElement)sender).TemplatedParent is Window self)
            {
                if (e.Source is Button btn)
                {
                    //string cmd = btn.Content.ToString().ToLower();
                    string cmd = btn.Tag.ToString().ToLower();
                    switch (cmd)
                    {
                        case "minimize":
                            {
                                self.Margin = new Thickness(0);
                                self.WindowState = WindowState.Minimized; break;
                            }
                        case "maximize":
                            {
                                self.WindowState ^= WindowState.Maximized;
                                break;
                            }
                        case "close": self.Close(); break;
                        default:
                            Debugger.Break();
                            break;
                    }
                }
            }
        }

        bool _IsWiden = false;

        private void Border_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (sender is Border sizeGap)
            {
                _IsWiden = true;
            }
        }

        private void Border_MouseUp(object sender, MouseButtonEventArgs e)
        {
            if (sender is Border sizeGap && _IsWiden)
            {
                sizeGap.ReleaseMouseCapture();
                _IsWiden = false;
            }
        }

        private void Border_MouseMove(object sender, MouseEventArgs e)
        {
            if (sender is Border sizeGap && _IsWiden)
            {
                sizeGap.CaptureMouse();
                Window window = Window.GetWindow(sizeGap);
                double width = e.GetPosition(window).X;
                double height = e.GetPosition(window).Y;
                if (width > window.MinWidth && height > window.MinHeight)
                {
                    window.Width = width;
                    window.Height = height;
                }
            }
        }

        private void Border_LostFocus(object sender, RoutedEventArgs e)
        {
            Border_MouseUp(sender, null);
        }
    }
}

```

### Navigate

Keys: Frame

```c#
pageFrame.Navigate(new System.Uri("Page1.xaml",UriKind.RelativeOrAbsolute));  
pageFrame.Source = new Uri(radioButton.CommandParameter.ToString(), UriKind.Relative);
(sender as Frame).NavigationService.RemoveBackEntry();
```
Keys: NavigationWindow

```xaml
Navigate 
//  Navigate(text2);  Navigate(button2);
// 	Navigate(new Uri("http://sellsbrothers.com"));

NavigationService navService =
  NavigationService.GetNavigationService((DependencyObject)sender);
navService.GoBack();

```

Keys: page#ctrlname

```xaml
<Hyperlink NavigateUri="Page2.xaml#topic1">Topic 1</Hyperlink>
<TextBlock Name="topic1">
	<TextBlock>Topic 1</TextBlock>
	<TextBlock>...</TextBlock>
</TextBlock>
```

Keys: PageFunction<T> 

```xaml
KeepAlive
OnReturn(ReturnEventArgs<T> e)
```

Keys: 

```xaml
```


### TextBlock

Keys: BitmapEffect

### TextBox

Keys：InputMethod.IsInputMethodEnabled、PreviewTextInput、InputBindings、KeyBinding

~~~c#
// 只能输入数字
Step1.设置属性 InputMethod.IsInputMethodEnabled="False"		// 禁用输入法
Step2.注册事件 在控件中添加  PreviewTextInput="rlimitnumber"事件
public void limitnumber(object sender, TextCompositionEventArgs e)
{   
	 Regex re = new Regex("[^0-9]+");   
	 e.Handled = re.IsMatch(e.Text);
}

~~~

~~~xaml
// 按下 Enter 键 触发命令
<TextBox>
	<TextBox.InputBindings>
		<KeyBinding Key="Enter" Command="{Binding LoginCommand}"
		CommandParameter="{Binding ElementName=window}"/>
	</TextBox.InputBindings>
</TextBox>
~~~

### ContentControl

<img src="Images\content_control.png" style="zoom:100%;" />

```
ContentControl --> Content
	HeaderedContentControl

ItemsControl --> Items
	HeaderedItemsControl
```



### ButtonBase

Keys: ControlTemplate、ContentPresenter、ContentTemplate(DataTemplate)

```xaml
<ControlTemplate x:Key="TogButtonStyle" TargetType="{x:Type ButtonBase}">
	<ContentPresenter
		x:Name="contentPresenter"
		Margin="{TemplateBinding Padding}"
		HorizontalAlignment="{TemplateBinding HorizontalContentAlignment}"
		VerticalAlignment="{TemplateBinding VerticalContentAlignment}"
		dx:BlendHelper2.ThemeInfo="Core\Core\Themes\Office2019Colorful\StandardControls\Button.xaml;8;8"
		Content="{TemplateBinding Content}"
		ContentStringFormat="{TemplateBinding ContentStringFormat}"
		ContentTemplate="{TemplateBinding ContentTemplate}"
		Focusable="False"
		RecognizesAccessKey="True"
		SnapsToDevicePixels="{TemplateBinding SnapsToDevicePixels}" />
</ControlTemplate>
```





### Button

Keys：ControlTemplate、Triggers、IsMouseOver、IsPressed

~~~xaml
// IconFont-Button Style
<Style TargetType="Button" x:Key="WindowControlButtonStyle">
	<Setter Property="Width" Value="40"/>
	<Setter Property="Height" Value="30"/>
	<Setter Property="Foreground" Value="White"/>
	<Setter Property="Template">
		<Setter.Value>
			<ControlTemplate TargetType="Button">
				<Border Background="Transparent" Name="back">
					<TextBlock Text="{Binding Content,RelativeSource={RelativeSource AncestorType=Button,Mode=FindAncestor}}"
				   VerticalAlignment="Center" HorizontalAlignment="Center"
				   FontFamily="../Fonts/#iconfont" FontSize="16"/>
				</Border>
				<ControlTemplate.Triggers>
					<Trigger Property="IsMouseOver" Value="True">
						<Setter TargetName="back" Property="Background" Value="#22FFFFFF"/>
					</Trigger>
					<Trigger Property="IsPressed" Value="True">
						<Setter TargetName="back" Property="Background" Value="#44FFFFFF"/>
					</Trigger>
				</ControlTemplate.Triggers>
			</ControlTemplate>
		</Setter.Value>
	</Setter>
</Style>
// Blue Button Style
<ControlTemplate x:Key="LoginButtonTemplate" TargetType="Button">
	<Border Background="#007DFA" CornerRadius="5">
		<Grid>
			<Border
				Name="back"
				Background="#22FFFFFF"
				CornerRadius="4"
				Visibility="Hidden" />
			<ContentControl
				HorizontalAlignment="Center"
				VerticalAlignment="Center"
				Content="{TemplateBinding Content}"
				Foreground="{TemplateBinding Foreground}" />
		</Grid>
	</Border>
	<ControlTemplate.Triggers>
		<Trigger Property="IsMouseOver" Value="True">
			<Setter TargetName="back" Property="Visibility" Value="Visible" />
		</Trigger>
		<Trigger Property="IsEnabled" Value="False">
			<Setter TargetName="back" Property="Visibility" Value="Visible" />
			<Setter TargetName="back" Property="Background" Value="#EEE" />
			<Setter Property="Foreground" Value="#AAA" />
		</Trigger>
	</ControlTemplate.Triggers>
</ControlTemplate>

~~~



### RadioButton

Keys：ContentControl、TemplateBinding、Content

```xaml
<Style TargetType="RadioButton" x:Key="NavButtonStyle">
    <Setter Property="Foreground" Value="White"/>
    <Setter Property="Template">
        <Setter.Value>
            <ControlTemplate TargetType="RadioButton">
                <Border Background="Transparent" CornerRadius="8" Name="back">
                    <ContentControl Content="{TemplateBinding Content}" VerticalAlignment="Center" HorizontalAlignment="Center" Margin="20,4" FontSize="13"/>
                </Border>
                <ControlTemplate.Triggers>
                    <Trigger Property="IsChecked" Value="True">
                        <Setter TargetName="back" Property="Background" Value="#44FFFFFF"/>
                    </Trigger>
                </ControlTemplate.Triggers>
            </ControlTemplate>
        </Setter.Value>
    </Setter>
</Style>
```





### ComboBox

Keys: DisplayMemberPath

```xaml
<ComboBox
	x:Name="cmbFunc"
	Grid.Column="1"
	DisplayMemberPath="name"
	ItemsSource="{Binding Functions}"
	SelectionChanged="{DXEvent Handler='Function_SelectionChanged(@s,@args)'}" />
```





### DataGrid

Keys：DataGridColumnHeader 



### Border

Keys：Effect、DropShadowEffect、ShadowDepth、BlurRadius、ImageBrush

~~~xaml
<!--
BlurRadius="5"：	阴影半径范围	
Direction="0"：	阴影方向
ShadowDepth="0"：	阴影深度偏移量，
Opacity="0.3"：	透明度
Color="Gray"：	颜色	-->

<Border
	Width="90"
	Height="80"
	Margin="0,0,0,20"
	HorizontalAlignment="Center"
	VerticalAlignment="Center"
	CornerRadius="50">
	<Border.Effect>
		<DropShadowEffect
			BlurRadius="5"
			Direction="0"
			Opacity="0.3"
			ShadowDepth="0"
			Color="White" />
	</Border.Effect>
	<Border.Background>
		<ImageBrush ImageSource="../Assets/Images/Logo.png"></ImageBrush>
	</Border.Background>
</Border>
~~~



### Image

Keys: Stretch

```csharp
// None
原始尺寸
// Uniform
拉伸以适应容器，但不保持宽高比
// Fill
填充(拉伸、布满)容器
// UniformToFill
保持宽高比，去填充(剩余被裁剪)

```

Keys: ImageBrush

```xaml
BorderBrush(Border)
Foreground(TextBlock)
Fill(shapes: Ellipse、Rectangle、Polygon、Line)

<ImageBrush  ImageSource="pack://application:,,,/Zhaoxi.HostComputer;component/Assets/Images/login_image.jpg"
Stretch="UniformToFill"
Viewbox="0,0,1.4,1" />
```

Keys: BitmapImage --> Image

```csharp
Image myImage = new Image();
BitmapImage bi = new BitmapImage();
bi.BeginInit();
bi.UriSource = new Uri("smiley.png", UriKind.Relative);
bi.EndInit();
myImage.Source = bi;
```





### ItemsControl

Keys：ItemContainerStyle、ItemTemplate、ItemsPanel、ItemsSource

```xaml
ItemsControl：ListBox、ListView，TreeView，TabControl
ItemContainerStyle 	(Item Style)
ItemTemplate		(Item DataTemplate)
ItemsPanelTemplate	(Items Panel)
```

Keys：ItemTemplateSelector (DataTemplateSelector)

```xaml
xmlns:ass="clr-namespace:WPFItemsControl.Assets"
<ItemsControl.ItemTemplateSelector>
	<ass:CourseDataTemplateSelector>
		<ass:CourseDataTemplateSelector.RealTemplate>
			<DataTemplate>
			...
			</DataTemplate>
		</ass:CourseDataTemplateSelector.RealTemplate>
		<ass:CourseDataTemplateSelector.SkeletonTemplate>
			<DataTemplate>
			...
			</DataTemplate>
		</ass:CourseDataTemplateSelector.SkeletonTemplate>
	</ass:CourseDataTemplateSelector>
</ItemsControl.ItemTemplateSelector>
```

```c#
public class CourseDataTemplateSelector : DataTemplateSelector
{
	public DataTemplate RealTemplate { get; set; }
	public DataTemplate SkeletonTemplate { get; set; }

	public override DataTemplate SelectTemplate(object item, DependencyObject container)
	{
		if ((item as CourseSeriesModel).IsShowSkeleton)
		{
			return SkeletonTemplate;
		}

		return RealTemplate;
		//return base.SelectTemplate(item, container);
	}
}
```

Keys: ItemsControl.Template、ItemsControl.ItemsPanel、ItemsControl.ItemTemplate、ItemsControl.ItemContainerStyle

```xaml
<ItemsControl Margin="10"
              ItemsSource="{Binding Source={StaticResource myTodoList}}">
  <!--The ItemsControl has no default visual appearance.
      Use the Template property to specify a ControlTemplate to define
      the appearance of an ItemsControl. The ItemsPresenter uses the specified
      ItemsPanelTemplate (see below) to layout the items. If an
      ItemsPanelTemplate is not specified, the default is used. (For ItemsControl,
      the default is an ItemsPanelTemplate that specifies a StackPanel.-->
  <ItemsControl.Template>
    <ControlTemplate TargetType="ItemsControl">
      <Border BorderBrush="Aqua" BorderThickness="1" CornerRadius="15">
        <ItemsPresenter/>
      </Border>
    </ControlTemplate>
  </ItemsControl.Template>
  <!--Use the ItemsPanel property to specify an ItemsPanelTemplate
      that defines the panel that is used to hold the generated items.
      In other words, use this property if you want to affect
      how the items are laid out.-->
  <ItemsControl.ItemsPanel>
    <ItemsPanelTemplate>
      <WrapPanel />
    </ItemsPanelTemplate>
  </ItemsControl.ItemsPanel>
  <!--Use the ItemTemplate to set a DataTemplate to define
      the visualization of the data objects. This DataTemplate
      specifies that each data object appears with the Priority
      and TaskName on top of a silver ellipse.-->
  <ItemsControl.ItemTemplate>
    <DataTemplate>
      <DataTemplate.Resources>
        <Style TargetType="TextBlock">
          <Setter Property="FontSize" Value="18"/>
          <Setter Property="HorizontalAlignment" Value="Center"/>
        </Style>
      </DataTemplate.Resources>
      <Grid>
        <Ellipse Fill="Silver"/>
        <StackPanel>
          <TextBlock Margin="3,3,3,0"
                     Text="{Binding Path=Priority}"/>
          <TextBlock Margin="3,0,3,7"
                     Text="{Binding Path=TaskName}"/>
        </StackPanel>
      </Grid>
    </DataTemplate>
  </ItemsControl.ItemTemplate>
  <!--Use the ItemContainerStyle property to specify the appearance
      of the element that contains the data. This ItemContainerStyle
      gives each item container a margin and a width. There is also
      a trigger that sets a tooltip that shows the description of
      the data object when the mouse hovers over the item container.-->
  <ItemsControl.ItemContainerStyle>
    <Style>
      <Setter Property="Control.Width" Value="100"/>
      <Setter Property="Control.Margin" Value="5"/>
      <Style.Triggers>
        <Trigger Property="Control.IsMouseOver" Value="True">
          <Setter Property="Control.ToolTip"
                  Value="{Binding RelativeSource={x:Static RelativeSource.Self},
                          Path=Content.Description}"/>
        </Trigger>
      </Style.Triggers>
    </Style>
  </ItemsControl.ItemContainerStyle>
</ItemsControl>
```



### ListBox

DisplayMemberPath

SelectedValuePath

SelectedValue

SelectedItem



### ListView

Keys：ItemContainerStyle、ItemTemplate、ItemsPanel

```xaml
<ListView
	Grid.Row="1"
	Margin="0,10,0,0"
	BorderThickness="0"
	ItemsSource="{Binding EmployeesCollectionView}">
	<ListView.View>
		<GridView>
			<GridViewColumn>
				<GridViewColumnHeader Content="Name" />
				<GridViewColumn.CellTemplate>
					<DataTemplate>
						<TextBlock Padding="0,0,50,0" Text="{Binding Name}" />
					</DataTemplate>
				</GridViewColumn.CellTemplate>
			</GridViewColumn>
			<GridViewColumn>
				<GridViewColumnHeader Content="Title" />
				<GridViewColumn.CellTemplate>
					<DataTemplate>
						<TextBlock Padding="0,0,50,0" Text="{Binding JobTitle}" />
					</DataTemplate>
				</GridViewColumn.CellTemplate>
			</GridViewColumn>
		</GridView>
	</ListView.View>
</ListView>
```

Keys: ItemContainerGenerator、ContainerFromItem、IndexFromContainer、ItemsControlFromItemContainer

```c#

ListView
	ItemContainerGenerator
		ContainerFromItem	// 根据 Data 获取 Item
		IndexFromContainer	// 根据 Item 获取 Index

ListViewItem


ItemsControl
	ItemsControlFromItemContainer	// 根据 Item 获取 Container

ListViewAdapWidth

// data --> Item
object data = obj.SelectedItem;
ListViewItem listViewItem = obj.ItemContainerGenerator.ContainerFromItem(data) as ListViewItem;

// Item --> Index
ListViewItem item = (ListViewItem)value;
ListView listView = ItemsControl.ItemsControlFromItemContainer(item) as ListView;
int index = listView.ItemContainerGenerator.IndexFromContainer(item);
```

Keys: IsDeferredScrollingEnabled

```xaml
延迟滚动 提高性能
ScrollViewer.IsDeferredScrollingEnabled="True" 
```





### TreeView

Keys：TreeView.Template(ControlTemplate)、TreeViewItem.Template(ControlTemplate)、ItemsPresenter

```xaml
<x:Array x:Key="templates" Type="{x:Type model:SingleTemplate}">
	<model:SingleTemplate
		Name="Template 1"
		IsAvailable="True"
		IsTemplateSelected="False"
		ParentBatID="1"
		State="0" />
	<model:SingleTemplate
		Name="Template 2"
		IsAvailable="True"
		IsTemplateSelected="False"
		ParentBatID="1"
		State="1" />
	<model:SingleTemplate
		Name="Template 3"
		IsAvailable="True"
		IsRenaming="True"
		IsTemplateSelected="False"
		ParentBatID="1"
		State="0" />
</x:Array>
<x:Array x:Key="Batches" Type="{x:Type model:BatchModel}">
	<model:BatchModel
		Name="BatchModel 1"
		ID="1"
		IsBatchSelected="False"
		IsSelected="True"
		Templates="{StaticResource templates}" />
	<model:BatchModel
		Name="BatchModel 2"
		ID="2"
		IsBatchSelected="False"
		Templates="{StaticResource templates}" />
	<model:BatchModel
		Name="BatchModel 3"
		ID="3"
		IsBatchSelected="True"
		IsExpanded="True"
		Templates="{StaticResource templates}" />
</x:Array>


<TreeView Name="tvTestQueue" ItemsSource="{StaticResource Batches}">
	<TreeView.Template>
		<ControlTemplate TargetType="{x:Type TreeView}">
			<Border BorderBrush="Red" BorderThickness="1">
				<ItemsPresenter />
			</Border>
		</ControlTemplate>
	</TreeView.Template>
	<TreeView.ItemContainerStyle>
		<Style TargetType="TreeViewItem">
			<Setter Property="IsExpanded" Value="True" />
			<!--<Setter Property="Template">
				<Setter.Value >
					<ControlTemplate TargetType="{x:Type TreeViewItem}">
					</ControlTemplate>
				</Setter.Value>
			</Setter>-->
		</Style>
	</TreeView.ItemContainerStyle>

	<TreeView.Resources>
		<HierarchicalDataTemplate DataType="{x:Type model:BatchModel}" ItemsSource="{Binding Templates}">
			<Grid>
				<Grid.RowDefinitions>
					<RowDefinition />
					<RowDefinition Height="1" />
				</Grid.RowDefinitions>
				<Border Name="groupBd" Margin="0">
					<StackPanel VerticalAlignment="Center" Orientation="Horizontal">
						<TextBlock
							x:Name="txtBlockTemplateSetsName"
							VerticalAlignment="Center"
							FontSize="12"
							FontWeight="Bold"
							Text="{Binding Name}"
							TextAlignment="Center"
							Visibility="{Binding IsRenaming, Converter={StaticResource BoolToInversedVisibilityConverter}}" />
						<TextBox
							x:Name="txtBoxTemplateSetsName"
							VerticalAlignment="Center"
							Focusable="True"
							FontSize="12"
							Tag="{Binding ID}"
							Text="{Binding Name}"
							TextAlignment="Left"
							ToolTip="{Binding Name}"
							Visibility="{Binding ElementName=txtBlockTemplateSetsName, Path=Visibility, Converter={StaticResource InversedVisibilityConverter}}" />

					</StackPanel>
				</Border>
				<Border
					Grid.Row="1"
					Background="#376BFA"
					Visibility="{Binding IsDragOver, Converter={StaticResource BoolToVisibilityConverter}}" />
			</Grid>
		</HierarchicalDataTemplate>

		<DataTemplate DataType="{x:Type model:SingleTemplate}">
			<Grid>
				<Grid.RowDefinitions>
					<RowDefinition />
					<RowDefinition Height="1" />
				</Grid.RowDefinitions>
				<Border
					Name="groupTemp"
					HorizontalAlignment="Stretch"
					Background="Transparent">
					<StackPanel
						VerticalAlignment="Center"
						IsEnabled="{Binding IsEnable}"
						Orientation="Horizontal">
						<TextBlock
							x:Name="txtBlockTemplateName"
							Margin="3,0,0,0"
							HorizontalAlignment="Left"
							VerticalAlignment="Center"
							Text="{Binding Name}"
							TextAlignment="Center"
							ToolTip="{Binding Name}"
							Visibility="{Binding IsRenaming, Converter={StaticResource BoolToInversedVisibilityConverter}}" />
						<TextBox
							x:Name="txtBoxTemplateName"
							HorizontalAlignment="Left"
							VerticalAlignment="Center"
							Focusable="True"
							Tag="{Binding TestId}"
							Text="{Binding Name}"
							TextAlignment="Center"
							ToolTip="{Binding Name}"
							Visibility="{Binding ElementName=txtBlockTemplateName, Path=Visibility, Converter={StaticResource InversedVisibilityConverter}}" />

						<TextBlock
							x:Name="txtBlockState"
							Margin="5,0,0,0"
							HorizontalAlignment="Left"
							VerticalAlignment="Center"
							Foreground="Red"
							Text="未完成"
							TextAlignment="Center"
							Visibility="{Binding State, Converter={StaticResource IntToVisibilityConverter}}" />
					</StackPanel>
				</Border>
				<Border
					Grid.Row="1"
					Background="#376BFA"
					Visibility="{Binding IsDragOver, Converter={StaticResource BoolToVisibilityConverter}}" />
			</Grid>

		</DataTemplate>
	</TreeView.Resources>
</TreeView>
```





### TabControl

Keys：ItemsControl、ItemsSource、ItemTemplate(DataTemplate)、ContentTemplate(DataTemplate)、ItemsPanel

~~~xaml
<TabControl
	MinHeight="150"
	Margin="0,7,0,0"
	ItemsSource="{Binding TabItems}"
	SelectedIndex="0">
	<TabControl.ItemTemplate>
		<DataTemplate DataType="{x:Type local:TabItem}">
			<TextBlock Text="{Binding Path=Header}" />
		</DataTemplate>
	</TabControl.ItemTemplate>
	<TabControl.ContentTemplate>
		<DataTemplate DataType="{x:Type local:TabItem}">
			<ItemsControl ItemsSource="{Binding AntennaPathlosses}">
				<ItemsControl.ItemTemplate>
					<DataTemplate DataType="{x:Type local:AntennaPathloss}">
						<StackPanel Margin="0,3,0,0" Orientation="Horizontal">
							<TextBlock
								Width="70"
								VerticalAlignment="Center"
								Text="{Binding Name, StringFormat='{}{0}：', Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
								TextAlignment="Left" />
							<TextBlock
								MaxWidth="232"
								VerticalAlignment="Center"
								Text="{Binding Pathloss, Mode=TwoWay, UpdateSourceTrigger=PropertyChanged}"
								TextAlignment="Left"
								TextTrimming="CharacterEllipsis"
								ToolTip="{Binding Pathloss}" />
							<Button
								Width="60"
								Height="20"
								Margin="5,0"
								HorizontalAlignment="Right"
								Click="AntennaPathlossBtn_Click"
								Content="{StaticResource trans0157}"
								Style="{StaticResource GTSStyleButtonWhite}"
								Tag="{Binding}" />
						</StackPanel>
					</DataTemplate>
				</ItemsControl.ItemTemplate>

				<ItemsControl.ItemsPanel>
					<ItemsPanelTemplate>
						<VirtualizingStackPanel />
					</ItemsPanelTemplate>
				</ItemsControl.ItemsPanel>
			</ItemsControl>
		</DataTemplate>
	</TabControl.ContentTemplate>
</TabControl>
~~~

~~~csharp
public AntennaPathloss SingleAntennaPathloss { get; set; } = new AntennaPathloss();
public ObservableCollection<TabItem> TabItems { get; set; } = new ObservableCollection<TabItem>();
	
	
public class TabItem : NotifyPropertyChanged
{
	private string header;

	public string Header
	{
		get { return header; }
		set { header = value; OnPropertyChanged(); }
	}

	public ObservableCollection<AntennaPathloss> AntennaPathlosses { get; set; } = new ObservableCollection<AntennaPathloss>();
}

public class AntennaPathloss : NotifyPropertyChanged
{
	private string name;

	public string Name
	{
		get { return name; }
		set { name = value; OnPropertyChanged(); }
	}

	private string pathloss;

	public string Pathloss
	{
		get { return pathloss; }
		set { pathloss = value; OnPropertyChanged(); }
	}
}
~~~

### Thumb

Keys: DargStated、DragDelta、DragCompleted

```xaml
DragStarted:	当按下鼠标左键，开始拖动时发生
DragDelta:		拖动仍在操作（没松开鼠标左键），它就会不断地发生
DragCompleted:	拖动操作结束后发生
```





### Expander

Keys：ExpandDirection、Hear、Content、IsExpanded

~~~xaml
<Expander ExpandDirection="Down" Width="96">
	<Expander.Header>
		<TextBlock Text="标题" FontWeight="Bold"/>
	</Expander.Header>
	<Expander.Content>
		<TextBlock TextWrapping="Wrap"  Text="这里是内容。"/>
	</Expander.Content>
</Expander> 
~~~

### Grid

Keys：

### GridSplitter

Keys：ResizeBehavior

```xaml
 <GridSplitter
                Grid.Column="1"
                Width="3"
                ResizeBehavior="PreviousAndNext" />
```

### Mouse

Keys: Capture

```xaml
将鼠标捕获到特定元素
若要释放鼠标捕获，则调用 Capture null 作为要捕获的元素传递，即 Capture(null)

private void Calendar_PreviewMouseUp(object sender, System.Windows.Input.MouseButtonEventArgs e)
{
	// release mouse capture (don't need focuse)
	// way1
	if (Mouse.Captured is CalendarItem)
	{
		Mouse.Capture(null);
	}
	return;
	// way2
	if (sender is UIElement ui)
	{
		ui.ReleaseMouseCapture();
	}
}
```

Keys: DirectlyOver

```xaml
静态获取桌面鼠标指上的元素
```

Keys: MouseEventArgs

```xaml
e.GetPosition(hitui) // 获取鼠标在相应元素的相对坐标
```



### UniformGrid

Keys：Columns、Resources、Style、TargetType

~~~xaml
<UniformGrid Columns="5" Grid.Row="1">
     <UniformGrid.Resources>
         <Style TargetType="TextBlock">
             <Style.Triggers>
                 <Trigger Property="IsMouseOver" Value="True">
                     <Setter Property="Foreground" Value="#007DFA"/>
                 </Trigger>
             </Style.Triggers>
         </Style>
     </UniformGrid.Resources>
     <TextBlock Text="&#xe71c;"/>
     <Border/>
     <TextBlock Text="&#xe601;"/>
     <Border/>
     <TextBlock Text="&#xe60c;"/>
</UniformGrid>
~~~

### UIElement

Keys：CacheMode

~~~xaml
// 界面卡顿优化: 界面缓存
<Polyline>
	<Polyline.CacheMode>
		<BitmapCache/>
	</Polyline.CacheMode>
</Polyline>
~~~

### Virtualization

Keys: Data Virtualization

```
Data Virtualization 通常情况下我们说数据虚拟化是指数据源没有完全加载，仅加载当前需要显示的数据呈现给用户。这种场景会让我们想到数据分页显示，当需要特定页面的数据时，根据页数请求相应数据

WPF没有提供对Data Virtualization原生态的支持，当时我们可以使用Paging相关技术来实现
```

Keys: UI Virtualization

```c#
启用虚拟化特性
VirtualizingPanel.IsVirtualizing="True"

启用数据分组虚拟化特性
VirtualizingPanel.IsVirtualizingWhenGrouping="True"

设置容器项再循环
VirtualizingPanel.VirtualizationMode="Recycling"
VirtualizingPanel.VirtualizationMode="Standard" // 在ListView进行滚动时，内存会增加。

缓存超过可视范围的附加项的数量. (在开始滚动时，可立即显示这些项)
VirtualizingPanel.CacheLength="100,500" // 在可视范围之前缓存100项，在可视范围之后缓存500项
缓存单位 
VirtualizingPanel.CacheLengthUnit="Item"

设置延迟滚动 (当用户在滚动条上拖动滚动滑块时不会更新列表显示，只有用户释放滚定滑块时才刷新)
ScrollViewer.IsDeferredScrollingEnabled="True"

设置滚动像素单元 (VirtualizingStackPanel通常使用基于项的滚动，这意味着当向下滚动少许时，下一项就显示出来。无法滚动查看项的一部分，在面板上至少会滚动一个完整项。可以通过属性覆盖该行为)
VirtualizingPanel.ScrollUnit="Pixel"
```

### Experience

> 1. 运行时 XAML 中的异常 不会被断点捕获到；
>
> 2. Binding时，模型属性一定 要添加 属性访问器 { get; set; }；
>
> 3. 添加现有文件，将文件属性中的生成操作设置为 Resource， 否则定位不到文件位置；
>
> 4. 只能针对 DependencyProperty 进行 Binding，不能针对 Property Binding；
>
> 5. Window 下设置 Border.Effect，不仅会严重损耗性能，而且在DropShadowEffect的Border内部添加展示的元素文本会模糊；
>
> 	~~~xaml
> 	<Border>
> 		<Border.Effect>
> 		 <DropShadowEffect
> 			BlurRadius="3"
> 			ShadowDepth="0"
> 			Color="LightGray" />
> 		</Border.Effect>
> 	</Border>
> 	~~~
>
> 6. Style 无法识别本地元素，ElementName 和 绑定的源属性; 
>
> 7. Validation.ErrorTemplate 默认红框不显示，原因：Window类默认的Style包含AdornerDecorator元素， 而UserControl没有。 主要是因为UserControl经常应用在Window里或者其他上下文已经有了AdornerLayer，
>
> 	~~~xaml
> 	解决办法： 在UserControl的逻辑树的根下添加AdornerDecorator， 如：
> 	<UserControl>
> 	     <AdornerDecorator>
> 	          <Grid Background="Yellow">
> 	               ...
> 	          </Grid>
> 	     </AdornerDecorator>
> 	</UserControl>
> 	~~~
>
> 8. 若干个 Control 同时叠加在同一个 Grid 上，可设置 VerticalAlignment 、HorizontalAlignment 以及 Margin 属性，调整 Control 间的相对位置，从而无须创建多余的行和列；
>
> 9. Style 中的  DataTrigger 允许 Binding 的源属性：依赖属性、DataContext 的模型属性。
>
> 	```xaml
> 	<Button>
> 		<Button.Style>
> 			<Style TargetType="Button">
> 				<Style.Triggers>
> 					<DataTrigger Binding="{Binding DataContext.ShowProgress, RelativeSource={RelativeSource Mode=FindAncestor, AncestorType=Window}}" Value="Visible">
> 						<Setter Property="IsEnabled" Value="False" />
> 					</DataTrigger>
> 				</Style.Triggers>
> 			</Style>
> 		</Button.Style>
> 	</Button>
> 	```
>
> 10. Stack 中的 ScrollViewer 无效，而 ScrollViewer -> ItemsControl 有效(超出会出现 Scroll)
>
> 11. XAML 引用 CS 枚举、静态、常量字符串
>
> 	```xaml
> 	xmlns:model="clr-namespace:Auto_OTA.Model"
>
> 	<DataTrigger Binding="{Binding State}" Value="{x:Static model:TestTaskState.Prepare }">
> 		<Setter TargetName="PART_TxtState" Property="Text" Value="&#xe61d;"/>
> 	</DataTrigger>
> 	```
>
> 	```c#
> 	/// <summary>
> 	/// 测试任务状态
> 	/// </summary>
> 	public enum TestTaskState
> 	{
> 		/// <summary>
> 		/// 未开始/已取消
> 		/// </summary>
> 		Prepare,
> 		/// <summary>
> 		/// 测试完成
> 		/// </summary>
> 		Done,
> 	}
> 	```
>
> 12. 找不到究竟是谁的 SrcollView Bar？运行起来 --> 查看可视化树 --> 查看源
>
> 13. 当父容器 ScrollViewer.HorizontalScrollBarVisibility="Disabled" ，子控件 DataGrid 自动铺满
>
> 14. StackPanel 无滚动条？解：在 StackPanel 外加 ScrollViewer，并设置 ScrollViewer MaxHeight
>
> 15. ComboBox 的   DisplayMemberPath="name" 的属性 需要 get ; set ;,  public string name { get; set; }
>
> 16. DxTheme 会影响 原始控件的样式 和 行为
>
> 17. 使用了 DevExpress UI层中的异常可能不会导致主程序异常退出
>
> 18. WPF Popup 中 IME 不跟随 TextBox
>
>     ```xaml
>      <Popup Opened="PART_Popup_Opened"/>
>     ```
>
>     ```c#
>     [DllImport("User32.dll")]
>     public static extern IntPtr SetFocus(IntPtr hWnd);
>
>     private IntPtr GetHwnd(Popup popup)
>     {
>         HwndSource source = (HwndSource)PresentationSource.FromVisual(popup.Child);
>         return source.Handle;
>     }
>
>     private void PART_Popup_Opened(object sender, System.EventArgs e)
>     {
>         Popup popup = sender as Popup;
>         IntPtr handle = GetHwnd(popup);
>         SetFocus(handle);
>     }
>     ```
>
> 19. 整体布局用 Grid，局部模块用 HorizontalAlignment、VerticalAlignment + Margin 调整，局部细节可选 Grid、xxxPanel 等
>
> 20. Borde 设置 BlurRadius (阴影模糊程度)，导致控件模糊，设置 SnapsToDevicePixels 为true，元素像素级对齐
>
> 21. 内联的属性优先级最大， Trigger 里面的优先级没它高，若用 DataTrigger + Binding，则用 Setter 设置好初始值，不要使用内联属性
>
> 22. 使用 Border，又不想包裹子元素，使用重叠方式
>
>     ```xaml
>     <Grid>
>     	<Border
>     		x:Name="border"
>     		Background="{TemplateBinding Background}"
>     		BorderBrush="Transparent"
>     		BorderThickness="1" />
>     	<DataGridCellsPresenter />
>     </Grid>
>     ```
>
> 23. 数据集合如何优化?
>
>     ```xaml
>     虚拟化、
>     延迟滚动  ScrollViewer.IsDeferredScrollingEnabled="True" 
>     分页
>     ```
>
> 24.编译器报错，运行没问题，可尝试删除 .vs 文件夹
>
> 25.WindowChrome 阴影
>
> ```xaml
> <Window
>     AllowsTransparency="True"
>     Background="Transparent"
>     FontFamily="Microsoft YaHei"
>     ResizeMode="NoResize"
>     WindowStartupLocation="CenterScreen"
>     WindowStyle="None"
>     mc:Ignorable="d">
>     <WindowChrome.WindowChrome>
>         <WindowChrome
>             CornerRadius="0"
>             GlassFrameThickness="-1"
>             NonClientFrameEdges="None"
>             ResizeBorderThickness="0"
>             UseAeroCaptionButtons="False" />
>     </WindowChrome.WindowChrome>
> 
>     <Window.DataContext>
>         <vm:LoginViewModel x:Name="VM" />
>     </Window.DataContext>
> 
>     <Grid>
>         <Border
>             Margin="5"
>             BorderBrush="#999999"
>             CornerRadius="5">
>             <Border.Effect>
>                 <DropShadowEffect
>                     BlurRadius="10"
>                     ShadowDepth="0"
>                     Color="LightGray" />
>             </Border.Effect>
> 		</Border>
> 	</Grid>
> </Window>
> ```
>
> 26.以画刷的方式 填充背景 ImageBrush
>
> ```xaml
> <Rectangle
> 	Width="28"
> 	Height="28"
> 	HorizontalAlignment="Center"
> 	VerticalAlignment="Center"
> 	RadiusX="10"
> 	RadiusY="10">
> 	<Rectangle.Fill>
> 		<ImageBrush ImageSource="/assets/user1.jpg" Stretch="UniformToFill" />
> 	</Rectangle.Fill>
> </Rectangle>
> ```
>
> 27.不重写 Button Style 的情况下，更改 Button Style
>
> ```xaml
> <Button
> 	Background="#FFF7542E"
> 	BorderThickness="0"
> 	Content="Search"
> 	FontSize="10"
> 	Foreground="White">
> 	<Button.Resources>
> 		<!--  to make border corner round  -->
> 		<Style TargetType="{x:Type Border}">
> 			<Setter Property="CornerRadius" Value="10" />
> 		</Style>
> 	</Button.Resources>
> </Button>
> ```
>
> 28.相对父容器位置偏移量
>
> ```c#
>  Point offset = child.TransformToVisual(parent).Transform(new Point());
> ```
> 



```xaml
两种定义 Region 的方式：

RegionManager.RegionName（XAML）
RegionManager.SetRegionName（Code）
1.<ContentControl Grid.Row="0" prism:RegionManager.RegionName="HeaderRegion" />
2.RegionManager.SetRegionName(Header, "HeaderRegion");

两种定义 View 与 Region 的映射关系
1.regionManager.RegisterViewWithRegion("HeaderRegion", typeof(HeaderView));
2.HeaderView headerView = container.Resolve<HeaderView>();
  regionManager.Regions["HeaderRegion"].Add(headerView);
```

View对象注册为单例对象
protected override void RegisterTypes(IContainerRegistry containerRegistry)
{
	containerRegistry.RegisterSingleton<HeaderView>();
	containerRegistry.RegisterSingleton<MenuView>();
	containerRegistry.RegisterSingleton<ContentView>();
}



```c#
RegionContext
<ContentControl prism:RegionManager.RegionContext="{Binding SelectedItem, ElementName=_listOfPeople}"/>
	
RegionContext.GetObservableContext(this).PropertyChanged += PersonDetail_PropertyChanged;

private void PersonDetail_PropertyChanged(object sender, System.ComponentModel.PropertyChangedEventArgs e)
{
	var context = (ObservableObject<object>)sender;
	var selectedPerson = (Person)context.Value;
	(DataContext as PersonDetailViewModel).SelectedPerson = selectedPerson;
}
```

### Event

```c#
PubSubEvent
	.Publish
	.Subscribe
```

### Navigation
```c#
public void RegisterTypes(IContainerRegistry containerRegistry)
{
    containerRegistry.RegisterForNavigation<ViewA>();
    containerRegistry.RegisterForNavigation<ViewB>();
}
_regionManager.RequestNavigate("ContentRegion", navigatePath);
	
INavigationAware
	.OnNavigatedTo
	.IsNavigationTarget
	.OnNavigatedFrom
IConfirmNavigationRequest
	.ConfirmNavigationRequest
IRegionMemberLifetime
	.KeepAlive
NavigationContext
```

### Dialog
​	IDialogAware
​	IDialogService



## 3D

[WPF 3D绘图-三维建模技术井眼轨迹图实现（一）-腾讯云开发者社区-腾讯云](https://cloud.tencent.com/developer/article/1760865)



## Blend

让一控件置于另一控件的 ControlTemplate:	点击 Gird --> 工具 --> 构成控件
添加触发器和动画
​				触发器 --> 激活时机
​		        --> 激活时操作: 故事板 选择时间 + 点击控件 + 设置转换属性

​				(先选择时间线，再设置属性)

将 Rectangle 转化为 Path

阴影围绕四周：ShadowDepth

添加动画缓冲器
	选中 EasingThicknessKeyFrame --> 杂项

变换：沿 x 轴正方向缩放，  RenderTransformOrigin="0,0.5" ---> ScaleTransform ScaleX="1.15"

## Github

ScreenToGif
SharpVectors
