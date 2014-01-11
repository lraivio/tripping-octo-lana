//
//  Action.h
//  mobile
//
//  Created by Lauri Raivio on 15.12.2013.
//  Copyright (c) 2013 Lauri Raivio. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ActionType.h"

@interface Action : NSObject

@property (strong, nonatomic) ActionType *type;
@property (nonatomic) NSInteger count;
@property (strong, nonatomic) NSDate *createdAt;

- (instancetype)initWithType:(ActionType *)type withCount:(NSUInteger)count;

- (NSString *)countAndUnitString;
- (NSString *)message;
- (NSString *)logTitle;
- (NSString *)timeAsString;
- (NSString *)getCreatedAtDate;
- (NSString *)getCreatedAtTime;

@end
