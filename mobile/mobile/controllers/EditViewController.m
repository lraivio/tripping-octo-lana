//
//  EditViewController.m
//  mobile
//
//  Created by Lauri Raivio on 9.1.2014.
//  Copyright (c) 2014 Lauri Raivio. All rights reserved.
//

#import "EditViewController.h"

@interface EditViewController ()
@property (weak, nonatomic) IBOutlet UILabel *sliderCountLabel;
@property (weak, nonatomic) IBOutlet UISlider *actionCountSlider;
@property (weak, nonatomic) IBOutlet UILabel *sliderMinValLabel;
@property (weak, nonatomic) IBOutlet UILabel *sliderMaxValLaleb;
@property (weak, nonatomic) IBOutlet UILabel *totalCountLabel;
@property (weak, nonatomic) IBOutlet UIDatePicker *datePicker;

@end

@implementation EditViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Overal setup.
    self.actionCountSlider.minimumValue = self.actionType.lowerLimit;
    self.actionCountSlider.maximumValue = self.actionType.upperLimit;
    self.sliderMinValLabel.text = [NSString stringWithFormat:@"%d", self.actionType.lowerLimit];
    self.sliderMaxValLaleb.text = [NSString stringWithFormat:@"%d", self.actionType.upperLimit];

    if (self.action) {
        // Setup for editing existing action.
        self.actionCountSlider.value = self.action.count;
        self.datePicker.date = self.action.createdAt;
    } else {
        // Setup for adding a new action.
        self.actionCountSlider.value = (NSInteger)(self.actionType.upperLimit / 2);
    }

    // Overall setup continues.
    NSInteger count = (int)floor(self.actionCountSlider.value);
    self.sliderCountLabel.text = [NSString stringWithFormat:@"%d%@", count, [self.actionType unitForCount]];
    [self setActionTotalText];
    self.datePicker.backgroundColor = [UIColor whiteColor];
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
}

- (IBAction)touchPushupButton:(UIButton *)sender {
    NSInteger count = (int)self.actionCountSlider.value;
    NSDate *when = self.datePicker.date;
    if (self.action) {
        [self.logger editAction:self.action withCount:count withDate:when];
        [self setActionTotalText];
//        [NSThread sleepForTimeInterval:0.50];
        [self.navigationController popViewControllerAnimated:YES];
    } else {
        [self.logger addActionWithType:self.actionType withCount:count withDate:when];
        [self setActionTotalText];
    }

}

- (void)setActionTotalText
{
    self.totalCountLabel.text = [NSString stringWithFormat:@"%@ total: %@%@",
                                 [self.actionType getTitle],
                                 ((NSNumber *)self.logger.totalCounts[self.actionType.type]).stringValue,
                                 [self.actionType unitForCount]];
}


#pragma mark - UI functionality

- (IBAction)onSliderValueChanged:(UISlider *)sender {
    NSInteger count = (int)floor(sender.value);
    self.sliderCountLabel.text = [NSString stringWithFormat:@"%d%@", count, [self.actionType unitForCount]];
}

- (IBAction)touchUpInsideSlider:(UISlider *)sender {
    [sender setValue:floor(sender.value) animated:YES];
}

- (IBAction)touchUpOutsideSlider:(UISlider *)sender {
    [sender setValue:floor(sender.value) animated:YES];
}

@end
