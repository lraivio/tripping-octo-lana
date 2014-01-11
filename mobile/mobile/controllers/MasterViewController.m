//
//  MasterViewController.m
//  mobile
//
//  Created by Lauri Raivio on 7.1.2014.
//  Copyright (c) 2014 Lauri Raivio. All rights reserved.
//

#import "MasterViewController.h"
#import "LogTableViewController.h"
#import "LifeLogger.h"
#import "MobileViewController.h"
#import "Action.h"

@interface MasterViewController () <UITabBarControllerDelegate>
@property (strong, nonatomic) LifeLogger* logger;
@end

@implementation MasterViewController

- (LifeLogger*)logger
{
    if (!_logger) _logger = [[LifeLogger alloc] init];
    return _logger;
}


- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)awakeFromNib
{
    self.delegate = self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
    [self.logger addExampleData];
    
    if ([self.viewControllers[0] isKindOfClass:[UINavigationController class]]) {
        UINavigationController *nvc = (UINavigationController *)self.viewControllers[0];
        if ([[nvc.viewControllers firstObject] isKindOfClass:[MobileViewController class]]) {
            MobileViewController *mvc = (MobileViewController *)[nvc.viewControllers firstObject];
            mvc.logger = self.logger;
        }
    }
    
    if ([self.viewControllers[1] isKindOfClass:[UINavigationController class]]) {
        UINavigationController *nvc = (UINavigationController *)self.viewControllers[1];
        if ([[nvc.viewControllers firstObject] isKindOfClass:[LogTableViewController class]]) {
            LogTableViewController *ltvc = (LogTableViewController *)[nvc.viewControllers firstObject];
            ltvc.logger = self.logger;
        }
    }
}

- (void)tabBarController:(UITabBarController *)tabBarController didSelectViewController:(UIViewController *)viewController
{
    if ([viewController isKindOfClass:[UINavigationController class]]) {
        UINavigationController *nvc = (UINavigationController *)viewController;
        if ([[nvc.viewControllers firstObject] isKindOfClass:[MobileViewController class]]) {
            MobileViewController *mvc = (MobileViewController *)[nvc.viewControllers firstObject];
            [mvc reloadTable];
        }
    }
}

@end
