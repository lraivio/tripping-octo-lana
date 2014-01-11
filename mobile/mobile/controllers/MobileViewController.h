//
//  MobileViewController.h
//  mobile
//
//  Created by Lauri Raivio on 15.12.2013.
//  Copyright (c) 2013 Lauri Raivio. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "LifeLogger.h"

@interface MobileViewController : UIViewController

@property (strong, nonatomic) LifeLogger *logger;

- (void)reloadTable;

@end
