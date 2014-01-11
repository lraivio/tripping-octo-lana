//
//  EditViewController.h
//  mobile
//
//  Created by Lauri Raivio on 9.1.2014.
//  Copyright (c) 2014 Lauri Raivio. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "LifeLogger.h"
#import "ActionType.h"
#import "Action.h"

@interface EditViewController : UIViewController

@property (strong, nonatomic) LifeLogger *logger;
@property (strong, nonatomic) ActionType *actionType;
@property (strong, nonatomic) Action *action;

@end
