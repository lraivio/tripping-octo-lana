//
//  ActionType.h
//  mobile
//
//  Created by Lauri Raivio on 9.1.2014.
//  Copyright (c) 2014 Lauri Raivio. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ActionType : NSObject

@property (strong, nonatomic) NSString *type;
@property (strong, nonatomic) NSString *unit;
@property (nonatomic) NSInteger lowerLimit;
@property (nonatomic) NSInteger upperLimit;
@property (strong, nonatomic) NSString *imageName;

- (NSString *)unitForCount;
- (NSString *)getTitle;
- (NSString *)getText;

@end
