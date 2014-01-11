//
//  LifeLogger.h
//  mobile
//
//  Created by Lauri Raivio on 15.12.2013.
//  Copyright (c) 2013 Lauri Raivio. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ActionType.h"
#import "Action.h"

@interface LifeLogger : NSObject

@property (nonatomic, strong, readonly) NSMutableArray *actionTypes;
@property (nonatomic, strong, readonly) NSMutableDictionary *actions;
@property (nonatomic, strong, readonly) NSMutableArray *actionKeys;
@property (nonatomic, strong, readonly) NSMutableDictionary *totalCounts;
@property (nonatomic, readonly) NSString *lastActionTime;
@property (nonatomic, readonly) NSString *lastActionMessage;

- (NSMutableArray *)sortedActionKeys;
- (NSMutableDictionary *)sortedActions;

- (void)addActionWithType:(ActionType *)type withCount:(NSInteger)count;
- (void)addActionWithType:(ActionType *)type withCount:(NSInteger)count withDate:(NSDate *)date;
- (void)editAction:(Action *)action withCount:(NSInteger)count withDate:(NSDate *)date;
- (void)addExampleData;

@end
