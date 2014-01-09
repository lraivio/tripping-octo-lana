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
using System.Windows.Shapes;

namespace UI_Desktop
{
    /// <summary>
    /// Interaction logic for AddMetricWindow.xaml
    /// </summary>
    public partial class AddMetricWindow : Window
    {
        private List<string> options;
        private List<string> units;

        public AddMetricWindow()
        {
            InitializeComponent();

            options = new List<string> { "Running", "Pushups", "Weight" };
            units = new List<string> {"count", "kg", "km"};
            MetricBox.ItemsSource = options;
            UnitsBox.ItemsSource = units;
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }

        private void MetricBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (e.AddedItems.Contains("Running"))
            {
                UnitsBox.SelectedValue = "km";
                CumulativeCheck.IsChecked = true;
            }
            else if (e.AddedItems.Contains("Pushups"))
            {
                UnitsBox.SelectedValue = "count";
                CumulativeCheck.IsChecked = true;
            }
            else if (e.AddedItems.Contains("Weight"))
            {
                UnitsBox.SelectedValue = "kg";
                CumulativeCheck.IsChecked = false;
            }
            else
            {
                UnitsBox.SelectedValue = "";
                CumulativeCheck.IsChecked = false;
            }
        }
    }
}
