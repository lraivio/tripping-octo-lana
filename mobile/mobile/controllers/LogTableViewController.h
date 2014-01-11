//
//  LogTableViewController.h
//  mobile
//
//  Created by Lauri Raivio on 7.1.2014.
//  Copyright (c) 2014 Lauri Raivio. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "LifeLogger.h"

@interface LogTableViewController : UITableViewController

@property (strong, nonatomic) LifeLogger *logger;
@property (strong, nonatomic) NSDictionary *actions;
@property (strong, nonatomic) NSArray *actionKeys;

@end
