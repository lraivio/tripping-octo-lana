using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace UI_Desktop
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private AddMetricWindow metricWindow;
        private ChallengeFriendWindow challengeFriendWindow;

        public static RoutedCommand HomeCommand = new RoutedCommand();
        public static RoutedCommand ReportCommand = new RoutedCommand();
        public static RoutedCommand CalendarCommand = new RoutedCommand();

        public static RoutedCommand NewMetricCommand = new RoutedCommand();
        
        public MainWindow()
        {
            InitializeComponent();
            HomeCommand.InputGestures.Add(new KeyGesture(Key.D1, ModifierKeys.Alt));
            ReportCommand.InputGestures.Add(new KeyGesture(Key.D2, ModifierKeys.Alt));
            CalendarCommand.InputGestures.Add(new KeyGesture(Key.D3, ModifierKeys.Alt));
            NewMetricCommand.InputGestures.Add(new KeyGesture(Key.N, ModifierKeys.Control));
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            challengeFriendWindow = new ChallengeFriendWindow {Owner = this};
            challengeFriendWindow.ShowDialog();
        }

        private void Button_Click_2(object sender, RoutedEventArgs e)
        {
            metricWindow = new AddMetricWindow {Owner = this};
            metricWindow.ShowDialog();
        }

        private void Button_Click_3(object sender, RoutedEventArgs e)
        {
            metricWindow = new AddMetricWindow {Owner = this};
            metricWindow.MetricBox.SelectedValue = "Pushups";
            metricWindow.ShowDialog();
        }

        private void Button_Click_4(object sender, RoutedEventArgs e)
        {
            HideStuff();
            ChallengesGroup.Visibility = Visibility.Visible;
            ProfileGroup.Visibility = Visibility.Visible;
            MetricsGroup.Visibility = Visibility.Visible;
        }

        private void Button_Click_5(object sender, RoutedEventArgs e)
        {
            HideStuff();
            CalendarImage.Visibility = Visibility.Visible;
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            HideStuff();
            ReportImage.Visibility = Visibility.Visible;
        }

        private void HideStuff()
        {
            ReportImage.Visibility = Visibility.Hidden;
            CalendarImage.Visibility = Visibility.Hidden;
            ChallengesGroup.Visibility = Visibility.Hidden;
            ProfileGroup.Visibility = Visibility.Hidden;
            MetricsGroup.Visibility = Visibility.Hidden;
        }

        private void Button_Click_6(object sender, RoutedEventArgs e)
        {
            Button_Click(null, null);
        }

        private void HomeCommandExecuted(object sender, ExecutedRoutedEventArgs e)
        {
            Button_Click_4(null, null);
        }
    }
}
